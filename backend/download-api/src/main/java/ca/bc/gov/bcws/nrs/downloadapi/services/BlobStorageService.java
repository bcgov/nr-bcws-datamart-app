package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.nio.file.Path;

import org.springframework.stereotype.Service;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;


@Service
public class BlobStorageService {

    private final BlobContainerClient blobContainerClient;

    public BlobStorageService(BlobContainerClient blobContainerClient) {

        this.blobContainerClient = blobContainerClient;
    }

    public String uploadFile(Path file) {

        BlobClient blobClient = blobContainerClient.getBlobClient(file.getFileName().toString());

        blobClient.uploadFromFile(file.toString(),true);

        return blobClient.getBlobUrl();
    }
}