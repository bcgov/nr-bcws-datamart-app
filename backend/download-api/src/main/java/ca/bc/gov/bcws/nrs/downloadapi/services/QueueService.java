package ca.bc.gov.bcws.nrs.downloadapi.services;

import com.azure.storage.queue.QueueClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;

@Service
public class QueueService {

    private static final Logger logger = LoggerFactory.getLogger(QueueService.class);

    private final QueueClient queueClient;
    private final ObjectMapper objectMapper;

    public QueueService(
            QueueClient queueClient,
            ObjectMapper objectMapper) {

        this.queueClient = queueClient;
        this.objectMapper = objectMapper;
    }

    public void enqueue(DownloadJobMessage message) {

        try {

            String payload = objectMapper.writeValueAsString(message);

            queueClient.sendMessage(payload);

            logger.info(
                    "Queued download job {} for {}",
                    message.getJobId(),
                    message.getEmailAddress());

        } catch (JsonProcessingException e) {

            throw new IllegalStateException(
                    "Failed to serialize queue message",
                    e);

        } catch (Exception e) {

            throw new IllegalStateException(
                    "Failed to queue download job",
                    e);
        }
    }
}