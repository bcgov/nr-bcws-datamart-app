package ca.bc.gov.bcws.nrs.downloadapi.services;

import com.azure.storage.queue.QueueClient;
import com.azure.storage.queue.models.PeekedMessageItem;
import com.azure.storage.queue.models.QueueMessageItem;
import com.azure.storage.queue.models.QueueProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;

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

    public QueuedDownloadJob dequeueMessage() {

        try {

            QueueMessageItem message = queueClient.receiveMessage();

            if (message == null) {
                return null;
            }

            logger.info("Dequeued message {}", message.getMessageId());

            DownloadJobMessage job = objectMapper.readValue(
                message.getBody().toString(),
                DownloadJobMessage.class);

            QueuedDownloadJob queuedJob = new QueuedDownloadJob();

            queuedJob.setMessageId(message.getMessageId());
            queuedJob.setPopReceipt(message.getPopReceipt());
            queuedJob.setDequeueCount(message.getDequeueCount());
            queuedJob.setJob(job);

            return queuedJob;

        } catch (JsonProcessingException e) {

            throw new IllegalStateException(
                "Failed to deserialize queue message",
                e);

        } catch (Exception e) {

            throw new IllegalStateException(
                "Failed to dequeue message",
                e);
        }
    }

    public void deleteMessage(String messageId, String popReceipt) {

        try {

            queueClient.deleteMessage(messageId, popReceipt);

            logger.info("Deleted message {}", messageId);

        } catch (Exception e) {

            throw new IllegalStateException(
                "Failed to delete queue message",
                e);
        }
    }

    public boolean messageAvailable(){
        PeekedMessageItem peekedMessageItem = queueClient.peekMessage();
        if (peekedMessageItem != null){
            return true;
        }
        return false;

    }

    public int totalMessages(){
       QueueProperties properties = queueClient.getProperties();
       int messageCount = properties.getApproximateMessagesCount();
       return messageCount;
    }

    
}