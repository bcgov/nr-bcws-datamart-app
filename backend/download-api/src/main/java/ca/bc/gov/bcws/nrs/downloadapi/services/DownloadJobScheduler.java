package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ca.bc.gov.bcws.nrs.downloadapi.config.DownloadSchedulerProperties;
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

        logger.info("Download scheduler started");
        if (!properties.isEnabled()) {
            return;
        }

        int processedMessageCount = 0;

        try {
            

            while (queueService.messageAvailable()){

                logger.info( "{} messages on queue",
                queueService.totalMessages());

                QueuedDownloadJob queuedJob = queueService.dequeueMessage(properties.getVisibilityTimeoutSeconds());

                if (queuedJob == null) {
                    continue;
                }
            
                logger.info("Retrieved queued job {}", queuedJob.getMessageId());

                try {

                    downloadJobProcessorService.process(queuedJob);

                    queueService.deleteMessage(
                        queuedJob.getMessageId(),
                        queuedJob.getPopReceipt());

                    processedMessageCount += 1;
                    logger.info("Removed queued job {}", queuedJob.getMessageId());
                } catch (Exception e) {
                    handleRetry(queuedJob, e);
                }
            }
        } catch (Exception e) {
                logger.error(
                    "Failed processing queued job",
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

            queueService.deleteMessage(
                queuedJob.getMessageId(),
                queuedJob.getPopReceipt());

            if (queuedJob.getJob().getEmailAddress() != null && !queuedJob.getJob().getEmailAddress().isBlank()) {

                emailService.sendDownloadFailedEmail(queuedJob.getJob().getEmailAddress(),
                    "Download processing failed after " + properties.getRetryCount() + " attempts.");
            }

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
                        

            return;
        }

        long retryDelayMinutes = properties.getRetryBackoffMinutes() * (long) Math.pow(2, queuedJob.getDequeueCount() - 1);

        logger.warn(
            "Job {} scheduled for retry {} in {} minute(s)",
            queuedJob.getJob().getJobId(),
            queuedJob.getDequeueCount() + 1,
            retryDelayMinutes);

        queueService.updateVisibilityTimeout(
            queuedJob.getMessageId(),
            queuedJob.getPopReceipt(),
            retryDelayMinutes);
    }

}