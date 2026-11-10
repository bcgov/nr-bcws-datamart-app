package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.UserDelegationKey;

@ExtendWith(MockitoExtension.class)
class BlobStorageServiceTest {

    @Mock
    private BlobContainerClient blobContainerClient;

    @Mock
    private BlobServiceClient blobServiceClient;

    @Mock
    private BlobClient blobClient;

    @InjectMocks
    private BlobStorageService service;

    @BeforeEach
    void setUp() throws Exception {

        setField(service, "sasExpiryDays", 7L);

        setField(
            service,
            "connectionString",
            "UseDevelopmentStorage=true");
    }

    @Test
    void uploadFile_UsesConnectionStringPath_WhenConfigured()
            throws Exception {

        Path file =
            Path.of("test.zip");

        when(blobContainerClient.getBlobClient("test.zip"))
            .thenReturn(blobClient);

        when(blobClient.getBlobUrl())
            .thenReturn("https://storage/test.zip");

        when(blobClient.generateSas(any()))
            .thenReturn("sas-token");

        String result =
            service.uploadFile(file);

        verify(blobClient)
            .uploadFromFile(
                file.toString(),
                true);

        verify(blobClient)
            .generateSas(any());

        assertEquals(
            "https://storage/test.zip?sas-token",
            result);
    }

    private void setField(
            Object target,
            String fieldName,
            Object value)
            throws Exception {

        Field field =
            target.getClass()
                .getDeclaredField(fieldName);

        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void uploadFile_UsesUserDelegationPath_WhenConnectionStringBlank()
            throws Exception {

        setField(
            service,
            "connectionString",
            "");

        Path file =
            Path.of("test.zip");

        UserDelegationKey delegationKey =
            new UserDelegationKey();

        when(blobContainerClient.getBlobClient("test.zip"))
            .thenReturn(blobClient);

        when(blobClient.getBlobUrl())
            .thenReturn("https://storage/test.zip");

        when(blobServiceClient.getUserDelegationKey(
                any(),
                any()))
            .thenReturn(delegationKey);

        when(blobClient.generateUserDelegationSas(
                any(),
                any(UserDelegationKey.class)))
            .thenReturn("delegation-token");

        String result =
            service.uploadFile(file);

        verify(blobClient)
            .uploadFromFile(
                file.toString(),
                true);

        verify(blobServiceClient)
            .getUserDelegationKey(
                any(),
                any());

        verify(blobClient)
            .generateUserDelegationSas(
                any(),
                any(UserDelegationKey.class));

        assertEquals(
            "https://storage/test.zip?delegation-token",
            result);
    }


}