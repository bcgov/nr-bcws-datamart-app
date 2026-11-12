package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ca.bc.gov.bcws.nrs.downloadapi.config.DownloadSchedulerProperties;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueueMessageException;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;


@Component
public class DownloadJobScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DownloadJobScheduler.class);

    private final DownloadSchedulerProperties properties;

    private final QueueService queueService;

    private final DownloadJobProcessorService downloadJobProcessorService;

    private final EmailService emailService;

    public DownloadJobScheduler(
            DownloadSchedulerProperties properties,
            QueueService queueService,
            DownloadJobProcessorService downloadJobProcessorService,
            EmailService emailService) {

        this.properties = properties;
        this.queueService = queueService;
        this.downloadJobProcessorService = downloadJobProcessorService;
        this.emailService = emailService;
    }

    @Scheduled(cron = "${download.scheduler.cron}")
    public void processQueue() {
        // If we add an additional consumer of this queue,
        //  and the original message becomes visible due to taking longer than 300 seconds
        // Then we will need to update this method to get the most recent pop receipt to delete it
        

        logger.info("Download scheduler started");
        if (!properties.isEnabled()) {
            return;
        }

        int processedMessageCount = 0;

        try {
            

            while (queueService.messageAvailable()){
                try {
                    logger.info( "{} messages on queue",
                    queueService.totalMessages());

                    QueuedDownloadJob queuedJob = queueService.dequeueMessage(properties.getVisibilityTimeoutSeconds());

                    if (queuedJob == null) {
                        continue;
                    }
                
                    logger.info("Retrieved queued job {}", queuedJob.getMessageId());

                    try {

                        downloadJobProcessorService.process(queuedJob);

                    } catch (Exception e) {

                        handleRetry(queuedJob, e);
                        continue;
                    }

                    try {

                        queueService.deleteMessage(queuedJob.getMessageId(), queuedJob.getPopReceipt());

                    } catch (Exception e) {

                        logger.error( "Successfully processed job {} but failed to delete queue message {}",
                            queuedJob.getJob().getJobId(),
                            queuedJob.getMessageId(),
                            e);
                    }
                } catch (InvalidQueueMessageException e) {

                    logger.error("Deleting invalid queue message {}",
                        e.getMessageId(),
                        e);

                    try {

                        queueService.deleteMessage(e.getMessageId(),e.getPopReceipt());

                    } catch (Exception deleteException) {

                        logger.error(
                            "Failed deleting invalid queue message {}",
                            e.getMessageId(),
                            deleteException);
                    }
            }
                            }
        } catch (Exception e) {

            logger.error(
                "Unexpected scheduler failure",
                e);
        }

        finally {
                logger.info("Download scheduler completed. {} messages processed",
                    processedMessageCount
                );
        }


    }

    private void handleRetry(QueuedDownloadJob queuedJob, Exception exception) {

        logger.error(
            "Failed processing job {} on attempt {}",
            queuedJob.getJob().getJobId(),
            queuedJob.getDequeueCount(),
            exception);

        if (queuedJob.getDequeueCount() >= properties.getRetryCount()) {

            logger.error(
                "Job {} exceeded maximum retry count of {}. Removing message from queue.",
                queuedJob.getJob().getJobId(),
                properties.getRetryCount());

            try {
                queueService.deleteMessage(queuedJob.getMessageId(), queuedJob.getPopReceipt());

            } catch (Exception e) {

                logger.error(
                    "Failed deleting exhausted queue message {}",
                    queuedJob.getMessageId(),
                    e);
            }

            if (queuedJob.getJob().getEmailAddress() != null && !queuedJob.getJob().getEmailAddress().isBlank()) {
                try {
                    emailService.sendDownloadFailedEmail(queuedJob.getJob().getEmailAddress(),
                    "Download processing failed after " + properties.getRetryCount() + " attempts.");
                    } catch (Exception e) {
                        logger.error(  "Failed sending user failure email",e);
                    }
            }
            try {
                emailService.sendAdminFailureEmail(
                    String.format(
                        """
                        Download job failed permanently.

                        Job ID: %s
                        User Email: %s
                        Queue Message ID: %s
                        Dequeue Count: %d
                        Retry Limit: %d
                        Exception Type: %s
                        Error: %s
                        """,
                        queuedJob.getJob().getJobId(),
                        queuedJob.getJob().getEmailAddress(),
                        queuedJob.getMessageId(),
                        queuedJob.getDequeueCount(),
                        properties.getRetryCount(),
                        exception.getClass().getSimpleName(),
                        exception.getMessage()));
            } catch (Exception e) {
                logger.error(
                    "Failed sending admin failure email",
                    e);
            }  

            return;
        }

        long retryDelayMinutes = properties.getRetryBackoffMinutes() * (long) Math.pow(2, queuedJob.getDequeueCount() - 1);

        logger.warn(
            "Job {} scheduled for retry {} in {} minute(s)",
            queuedJob.getJob().getJobId(),
            queuedJob.getDequeueCount() + 1,
            retryDelayMinutes);
        try {
            queueService.updateVisibilityTimeout(
                queuedJob.getMessageId(),
                queuedJob.getPopReceipt(),
                retryDelayMinutes);
        } catch (Exception e) {
            logger.error(
                "Failed updating visibility timeout for job {}",
                queuedJob.getJob().getJobId(),
                e);
        }
    }

}