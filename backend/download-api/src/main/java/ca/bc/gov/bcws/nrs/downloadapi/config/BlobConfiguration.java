package ca.bc.gov.bcws.nrs.downloadapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;

@Configuration
public class BlobConfiguration {

    @Bean
    public BlobContainerClient blobContainerClient(
            @Value("${download.blob-container-name}") String containerName,
            @Value("${download.storage-account-name:}") String storageAccountName,
            @Value("${download.blob-client-id:}") String managedIdentityClientId,
            @Value("${download.blob-connection-string:}") String connectionString) {

        if (containerName.isBlank())
            throw new IllegalStateException(
                    "download.blob-container-name must be configured.");

        if (!connectionString.isBlank()) {
            return new BlobContainerClientBuilder()
                    .connectionString(connectionString)
                    .containerName(containerName)
                    .buildClient();
        }

        if (storageAccountName.isBlank())
            throw new IllegalStateException(
                    "Either download.blob-connection-string or download.storage-account-name must be configured.");

        if (managedIdentityClientId.isBlank())
            throw new IllegalStateException(
                    "download.blob-client-id must be configured when using managed identity.");

        ManagedIdentityCredential credential =
                new ManagedIdentityCredentialBuilder()
                        .clientId(managedIdentityClientId)
                        .build();

        return new BlobContainerClientBuilder()
                .endpoint(String.format(
                        "https://%s.blob.core.windows.net/%s",
                        storageAccountName,
                        containerName))
                .credential(credential)
                .buildClient();
    }
}
