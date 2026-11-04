package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;

@Service
public class DownloadJobProcessorService {

    private static final Logger logger = LoggerFactory.getLogger(DownloadJobProcessorService.class);

    public void process(QueuedDownloadJob queuedJob) {

        logger.info(
            "Processing job {} for {}",
            queuedJob.getJob().getJobId(),
            queuedJob.getJob().getEmailAddress());

    }
}