package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.azure.storage.queue.models.QueueMessageItem;

import ca.bc.gov.bcws.nrs.downloadapi.config.DownloadSchedulerProperties;

@Component
public class DownloadJobScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DownloadJobScheduler.class);

    private final DownloadSchedulerProperties properties;

    private final QueueService queueService;

    public DownloadJobScheduler( DownloadSchedulerProperties properties, QueueService queueService) {
        this.properties = properties;
        this.queueService = queueService;
    }

    @Scheduled(cron = "${download.scheduler.cron}")
    public void processQueue() {

        if (!properties.isEnabled()) {
            return;
        }

        QueueMessageItem message = queueService.dequeueMessage();

        if (message == null) {

            logger.info( "Download scheduler found no queued jobs");
            return;
        }

        logger.info("Retrieved queued job {}",message.getMessageId());

        logger.info("Retrieved queued job {} with body {}",message.getMessageId(),message.getBody().toString());

        queueService.deleteMessage(message.getMessageId(),message.getPopReceipt());

        logger.info("Removed queued job {}", message.getMessageId());
    }

}