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

    public DownloadJobScheduler(
            DownloadSchedulerProperties properties,
            QueueService queueService,
            DownloadJobProcessorService downloadJobProcessorService) {

        this.properties = properties;
        this.queueService = queueService;
        this.downloadJobProcessorService = downloadJobProcessorService;
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

                QueuedDownloadJob queuedJob = queueService.dequeueMessage();
            
                logger.info("Retrieved queued job {}", queuedJob.getMessageId());

                downloadJobProcessorService.process(queuedJob);

                queueService.deleteMessage(
                    queuedJob.getMessageId(),
                    queuedJob.getPopReceipt());

                processedMessageCount += 1;

                logger.info("Removed queued job {}", queuedJob.getMessageId());
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

}