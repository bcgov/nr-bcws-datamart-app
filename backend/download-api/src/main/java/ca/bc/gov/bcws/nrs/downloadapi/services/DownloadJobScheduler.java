package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ca.bc.gov.bcws.nrs.downloadapi.config.DownloadSchedulerProperties;

@Component
public class DownloadJobScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DownloadJobScheduler.class);

    private final DownloadSchedulerProperties properties;

    public DownloadJobScheduler(DownloadSchedulerProperties properties) {
        this.properties = properties;
    }

    @Scheduled(cron = "${download.scheduler.cron}")
    public void processQueue() {

        if (!properties.isEnabled()) {
            logger.debug("Download job scheduler is disabled");
            return;
        }

        logger.info("Download scheduler triggered. Enabled={}, Cron={}, VisibilityTimeout={}s",
            properties.isEnabled(),
            properties.getCron(),
            properties.getVisibilityTimeoutSeconds());
    }
}