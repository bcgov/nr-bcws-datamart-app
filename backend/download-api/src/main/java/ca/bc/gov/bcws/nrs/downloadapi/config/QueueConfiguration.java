package ca.bc.gov.bcws.nrs.downloadapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.storage.queue.QueueClient;
import com.azure.storage.queue.QueueClientBuilder;

@Configuration
public class QueueConfiguration {

    @Bean
    public QueueClient queueClient(
            @Value("${download.queue-name}") String queueName,
            @Value("${download.storage-account-name:}") String storageAccountName,
            @Value("${download.queue-client-id:}") String managedIdentityClientId,
            @Value("${download.queue-connection-string:}") String connectionString) {

        if (queueName.isBlank()) {
            throw new IllegalStateException(
                    "download.queue-name must be configured.");
        }

        if (!connectionString.isBlank()) {
            return new QueueClientBuilder()
                    .connectionString(connectionString)
                    .queueName(queueName)
                    .buildClient();
        }

        if (storageAccountName.isBlank()) {
            throw new IllegalStateException(
                    "Either download.queue-connection-string or download.storage-account-name must be configured.");
        }

        if (managedIdentityClientId.isBlank()) {
            throw new IllegalStateException(
                    "download.queue-client-id must be configured when using managed identity.");
        }

        ManagedIdentityCredential credential =
                new ManagedIdentityCredentialBuilder()
                        .clientId(managedIdentityClientId)
                        .build();

        return new QueueClientBuilder()
                .endpoint(String.format(
                        "https://%s.queue.core.windows.net/%s",
                        storageAccountName,
                        queueName))
                .credential(credential)
                .buildClient();
    }
}