package ca.bc.gov.bcws.nrs.downloadapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Path;
import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.UserDelegationKey;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;

@Service
public class BlobStorageService {
    private static final Logger logger = LoggerFactory.getLogger(BlobStorageService.class);

    private final BlobContainerClient blobContainerClient;

    private final BlobServiceClient blobServiceClient;

    @Value("${download.sas-expiry-days:7}")
    private long sasExpiryDays;

    @Value("${download.blob-connection-string:}")
    private String connectionString;

    public BlobStorageService(
            BlobContainerClient blobContainerClient,
            BlobServiceClient blobServiceClient) {

        this.blobContainerClient = blobContainerClient;
        this.blobServiceClient = blobServiceClient;
    }

    public String uploadFile(Path file) {
        
        logger.info("About to retrieve blobContainerClient name '{}' with container URL '{}'",
            blobContainerClient.getBlobContainerName(),
            blobContainerClient.getBlobContainerUrl());

        BlobClient blobClient = blobContainerClient.getBlobClient(file.getFileName().toString());

        blobClient.uploadFromFile(file.toString(), true);

        logger.info("Uploaded blob {}",blobClient.getBlobUrl());

        return generateSasUrl(blobClient);
    }

   private String generateSasUrl(BlobClient blobClient) {

        OffsetDateTime expiry = OffsetDateTime.now().plusDays(sasExpiryDays);

        BlobSasPermission permissions =new BlobSasPermission().setReadPermission(true);

        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiry, permissions);

        String sasToken;

        logger.info("Generating download URL with {} day expiry", sasExpiryDays);

        if (!connectionString.isBlank()) {

            sasToken = blobClient.generateSas(sasValues);

        } else {

            UserDelegationKey delegationKey = blobServiceClient.getUserDelegationKey(OffsetDateTime.now(), expiry);

            sasToken = blobClient.generateUserDelegationSas( sasValues, delegationKey);
        }

        logger.info("Generated download URL for {}", blobClient.getBlobUrl());

        return blobClient.getBlobUrl() + "?" + sasToken;
    }

}