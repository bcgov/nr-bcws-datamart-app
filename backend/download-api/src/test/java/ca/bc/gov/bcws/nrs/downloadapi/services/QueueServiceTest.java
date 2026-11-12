package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.azure.storage.queue.QueueClient;
import com.azure.storage.queue.models.PeekedMessageItem;

import com.azure.storage.queue.models.QueueProperties;
import com.azure.storage.queue.models.UpdateMessageResult;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;


@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private QueueClient queueClient;

    private QueueService queueService;

    @BeforeEach
    void setUp() {
        queueService =
            new QueueService(
                queueClient,
                new ObjectMapper());
    }

    @Test
    void enqueue_ValidMessage_SendsMessage() {

        DownloadJobMessage message =
            new DownloadJobMessage();

        message.setJobId("job-123");
        message.setEmailAddress("user@test.com");

        queueService.enqueue(message);

        verify(queueClient)
            .sendMessage(anyString());
    }

    @Test
    void enqueue_SerializationFailure_ThrowsException() {

        ObjectMapper mapper = org.mockito.Mockito.mock(ObjectMapper.class);

        queueService =
            new QueueService(queueClient, mapper);

        DownloadJobMessage message =
            new DownloadJobMessage();

        try {
            when(mapper.writeValueAsString(any()))
                .thenThrow(
                    new com.fasterxml.jackson.core.JsonProcessingException(
                        "serialization error") {
                    });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        assertThrows(
            IllegalStateException.class,
            () -> queueService.enqueue(message));
    }


    @Test
    void messageAvailable_ReturnsTrue() {

        PeekedMessageItem message =
            new PeekedMessageItem();

        when(queueClient.peekMessage())
            .thenReturn(message);

        assertTrue(
            queueService.messageAvailable());
    }

    @Test
    void messageAvailable_ReturnsFalse() {

        when(queueClient.peekMessage())
            .thenReturn(null);

        assertFalse(
            queueService.messageAvailable());
    }


    @Test
    void totalMessages_ReturnsCount() {

        QueueProperties properties =
            org.mockito.Mockito.mock(QueueProperties.class);

        when(properties.getApproximateMessagesCount())
            .thenReturn(17);

        when(queueClient.getProperties())
            .thenReturn(properties);

        assertEquals(
            17,
            queueService.totalMessages());
    }

    @Test
    void deleteMessage_DeletesMessage() {

        queueService.deleteMessage(
            "message-123",
            "receipt-123");

        verify(queueClient)
            .deleteMessage(
                "message-123",
                "receipt-123");
    }

    @Test
    void updateVisibilityTimeout_UpdatesMessage() {

        UpdateMessageResult result =
            org.mockito.Mockito.mock(
                UpdateMessageResult.class);

        when(queueClient.updateMessage(
            anyString(),
            anyString(),
            any(),
            any(Duration.class)))
            .thenReturn(result);

        queueService.updateVisibilityTimeout(
            "message-123",
            "receipt-123",
            5);

        verify(queueClient)
            .updateMessage(
                eq("message-123"),
                eq("receipt-123"),
                eq(null),
                any(Duration.class));
    }




}