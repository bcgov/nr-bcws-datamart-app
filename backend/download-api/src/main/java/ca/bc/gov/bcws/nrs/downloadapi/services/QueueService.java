package ca.bc.gov.bcws.nrs.downloadapi.services;

import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.storage.queue.QueueClient;
import com.azure.storage.queue.QueueClientBuilder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
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
            @Value("${download.queue-name}") String queueName,
            @Value("${download.storage-account-name}") String storageAccountName,
            @Value("${download.queue-client-id}") String managedIdentityClientId,
            ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        ManagedIdentityCredential credential = new ManagedIdentityCredentialBuilder().clientId(managedIdentityClientId).build();

        this.queueClient = new QueueClientBuilder()
                .endpoint(String.format("https://%s.queue.core.windows.net/%s", storageAccountName, queueName))
                .credential(credential)
                .buildClient();

        logger.info("Queue service initialized for queue '{}' in storage account '{}'",
                queueName,
                storageAccountName);
    }

    public void enqueue(DownloadJobMessage message) {

        try {

            String payload = objectMapper.writeValueAsString(message);

            queueClient.sendMessage(payload);

            logger.info("Queued download job {} for {}",
                    message.getJobId(),
                    message.getEmailAddress());

        } catch (JsonProcessingException e) {

            throw new IllegalStateException("Failed to serialize queue message", e);

        } catch (Exception e) {

            throw new IllegalStateException("Failed to queue download job", e);
        }
    }
}