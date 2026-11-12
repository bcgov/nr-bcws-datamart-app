package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;

@ExtendWith(MockitoExtension.class)
class NotifyEmailServiceTest {

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private RestClient.RequestBodySpec requestBodySpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private NotifyEmailService service;

    @BeforeEach
    void setUp() throws Exception {

        service = new NotifyEmailService(restClient);

        setField(service, "apiKey", "api-key");
        setField(service, "emailEndpoint", "https://notify.test");
        setField(service, "downloadSuccessTemplateId", "success-template");
        setField(service, "downloadFailureTemplateId", "failure-template");
        setField(service, "adminEmail", "admin@test.com");

        lenient().when(restClient.post())
            .thenReturn(requestBodyUriSpec);

        lenient().when(requestBodyUriSpec.uri(anyString()))
            .thenReturn(requestBodySpec);

        lenient().when(requestBodySpec.header(anyString(), anyString()))
            .thenReturn(requestBodySpec);

        lenient().when(requestBodySpec.body(any(Object.class)))
            .thenReturn(requestBodySpec);

        lenient().when(requestBodySpec.retrieve())
            .thenReturn(responseSpec);

        lenient().when(responseSpec.toBodilessEntity())
            .thenReturn(ResponseEntity.ok().build());
    }

    @Test
    void sendDownloadReadyEmail_SendsRequest() {

        service.sendDownloadReadyEmail(
            "user@test.com",
            "https://storage/test.zip");

        verify(restClient)
            .post();
    }

    @Test
    void sendDownloadFailedEmail_SendsRequest() {

        service.sendDownloadFailedEmail(
            "user@test.com",
            "failure reason");

        verify(restClient)
            .post();
    }

    @Test
    void sendAdminFailureEmail_AdminConfigured_SendsEmail() {

        service.sendAdminFailureEmail(
            "Admin failure message");

        verify(restClient)
            .post();
    }

    @Test
    void sendAdminFailureEmail_NoAdminEmail_DoesNothing()
            throws Exception {

        setField(service, "adminEmail", "");

        service.sendAdminFailureEmail(
            "Admin failure message");

        verify(restClient, never())
            .post();
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
}