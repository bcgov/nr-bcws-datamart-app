package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ca.bc.gov.bcws.nrs.downloadapi.config.DownloadSchedulerProperties;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;

@ExtendWith(MockitoExtension.class)
class DownloadJobSchedulerTest {

    @Mock
    private DownloadSchedulerProperties properties;

    @Mock
    private QueueService queueService;

    @Mock
    private DownloadJobProcessorService downloadJobProcessorService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private DownloadJobScheduler scheduler;

    @Test
    void processQueue_Disabled_DoesNothing() {

        when(properties.isEnabled()).thenReturn(false);

        scheduler.processQueue();

        verify(queueService, never()).messageAvailable();
    }

    @Test
    void processQueue_NoMessages_DoesNothing() {

        when(properties.isEnabled()).thenReturn(true);

        when(queueService.messageAvailable())
            .thenReturn(false);

        scheduler.processQueue();

        verify(queueService, never())
            .dequeueMessage(any(Integer.class));
    }

    @Test
    void processQueue_ProcessesSuccessfulJob() {

        QueuedDownloadJob job = buildJob(
            1,
            "user@test.com");

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(job);

        scheduler.processQueue();

        verify(downloadJobProcessorService)
            .process(job);

        verify(queueService)
            .deleteMessage(
                job.getMessageId(),
                job.getPopReceipt());

        verify(queueService, never())
            .updateVisibilityTimeout(
                any(),
                any(),
                anyLong());
    }

    @Test
    void processQueue_FailedJobBelowRetryLimit_SchedulesRetry() {

        QueuedDownloadJob job = buildJob(
            1,
            "user@test.com");

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getRetryCount())
            .thenReturn(5);

        when(properties.getRetryBackoffMinutes())
            .thenReturn(5);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(job);

        doThrow(new RuntimeException("Test failure"))
            .when(downloadJobProcessorService)
            .process(job);

        scheduler.processQueue();

        verify(queueService)
            .updateVisibilityTimeout(
                job.getMessageId(),
                job.getPopReceipt(),
                5L);

        verify(queueService, never())
            .deleteMessage(
                job.getMessageId(),
                job.getPopReceipt());

        verify(emailService, never())
            .sendDownloadFailedEmail(
                any(),
                any());

        verify(emailService, never())
            .sendAdminFailureEmail(any());
    }

    @Test
    void processQueue_FailedJobAtRetryLimit_DeletesMessageAndSendsEmails() {

        QueuedDownloadJob job = buildJob(
            5,
            "user@test.com");

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getRetryCount())
            .thenReturn(5);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(job);

        doThrow(new RuntimeException("Test failure"))
            .when(downloadJobProcessorService)
            .process(job);

        scheduler.processQueue();

        verify(queueService)
            .deleteMessage(
                job.getMessageId(),
                job.getPopReceipt());

        verify(emailService)
            .sendDownloadFailedEmail(
                job.getJob().getEmailAddress(),
                "Download processing failed after 5 attempts.");

        verify(emailService)
            .sendAdminFailureEmail(any());
    }

    @Test
    void processQueue_FailedJobWithoutUserEmail_OnlySendsAdminEmail() {

        QueuedDownloadJob job = buildJob(
            5,
            null);

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getRetryCount())
            .thenReturn(5);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(job);

        doThrow(new RuntimeException("Test failure"))
            .when(downloadJobProcessorService)
            .process(job);

        scheduler.processQueue();

        verify(emailService, never())
            .sendDownloadFailedEmail(
                any(),
                any());

        verify(emailService)
            .sendAdminFailureEmail(any());
    }

    @Test
    void processQueue_NullDequeuedJob_IsIgnored() {

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(null);

        scheduler.processQueue();

        verify(downloadJobProcessorService, never())
            .process(any());
    }

    @Test
    void processQueue_FailureDoesNotPreventProcessingNextJob() {

        QueuedDownloadJob failedJob =
            buildJob(1, "first@test.com");

        QueuedDownloadJob successfulJob =
            buildJob(1, "second@test.com");

        when(properties.isEnabled()).thenReturn(true);

        when(properties.getRetryCount())
            .thenReturn(5);

        when(properties.getRetryBackoffMinutes())
            .thenReturn(5);

        when(properties.getVisibilityTimeoutSeconds())
            .thenReturn(300);

        when(queueService.messageAvailable())
            .thenReturn(true)
            .thenReturn(true)
            .thenReturn(false);

        when(queueService.dequeueMessage(300))
            .thenReturn(failedJob)
            .thenReturn(successfulJob);

        doThrow(new RuntimeException("failure"))
            .when(downloadJobProcessorService)
            .process(failedJob);

        scheduler.processQueue();

        verify(downloadJobProcessorService)
            .process(failedJob);

        verify(downloadJobProcessorService)
            .process(successfulJob);

        verify(queueService)
            .deleteMessage(
                successfulJob.getMessageId(),
                successfulJob.getPopReceipt());
    }

    private QueuedDownloadJob buildJob(
            int dequeueCount,
            String emailAddress) {

        DownloadJobMessage downloadJob =
            new DownloadJobMessage();

        downloadJob.setJobId("job-123");
        downloadJob.setEmailAddress(emailAddress);

        QueuedDownloadJob queuedJob =
            new QueuedDownloadJob();

        queuedJob.setJob(downloadJob);
        queuedJob.setMessageId("message-123");
        queuedJob.setPopReceipt("receipt-123");
        queuedJob.setDequeueCount(Long.valueOf(dequeueCount));

        return queuedJob;
    }
}