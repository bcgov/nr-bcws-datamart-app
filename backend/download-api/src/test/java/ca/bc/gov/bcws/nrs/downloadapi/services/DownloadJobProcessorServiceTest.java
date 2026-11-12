package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.BufferedWriter;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;

@ExtendWith(MockitoExtension.class)
class DownloadJobProcessorServiceTest {

    @Mock
    private DatamartApiClient datamartApiClient;

    @Mock
    private CsvService csvService;

    @Mock
    private DatamartQueryService datamartQueryService;

    @Spy
    private ZipService zipService;

    @Mock
    private BlobStorageService blobStorageService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private DownloadJobProcessorService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void process_SuccessfulJob_UploadsZipAndSendsEmail() throws Exception {

        JsonNode response = objectMapper.readTree("""
            {
              "data": {
                "daily_weathers": {
                  "items": [
                    {
                      "STATION_NAME": "TEST"
                    }
                  ],
                  "hasNextPage": false,
                  "endCursor": null
                }
              }
            }
            """);

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery(
            "query { daily_weathers { items { STATION_NAME } } }");

        DownloadJobMessage job = new DownloadJobMessage();
        job.setJobId("job-123");
        job.setEmailAddress("user@test.com");
        job.setStartDate("2022-08-01");
        job.setEndDate("2022-09-01");
        job.setQueries(List.of(query));

        QueuedDownloadJob queuedJob = new QueuedDownloadJob();
        queuedJob.setJob(job);

        when(datamartQueryService.applyPaging(any(), any()))
            .thenReturn(query.getQuery());

        when(datamartApiClient.executeQuery(any()))
            .thenReturn(response);

        when(blobStorageService.uploadFile(any(Path.class)))
            .thenReturn("https://storage/test.zip");

        service.process(queuedJob);

        verify(datamartApiClient)
            .executeQuery(any());

        verify(csvService)
            .appendRows(
                any(JsonNode.class),
                any(BufferedWriter.class),
                anyBoolean());

        verify(blobStorageService)
            .uploadFile(any(Path.class));

        verify(emailService)
            .sendDownloadReadyEmail(
                "user@test.com",
                "https://storage/test.zip");
    }

    @Test
    void process_MultiplePages_QueriesUntilHasNextPageFalse() throws Exception {

        JsonNode page1 = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [
                    { "ID": 1 }
                ],
                "hasNextPage": true,
                "endCursor": "cursor1"
                }
            }
            }
            """);

        JsonNode page2 = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [
                    { "ID": 2 }
                ],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """);

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery("query { daily_weathers { items { ID } } }");

        DownloadJobMessage job = new DownloadJobMessage();
        job.setJobId("job-123");
        job.setEmailAddress("user@test.com");
        job.setStartDate("2022-08-01");
        job.setEndDate("2022-09-01");
        job.setQueries(List.of(query));

        QueuedDownloadJob queuedJob = new QueuedDownloadJob();
        queuedJob.setJob(job);

        when(datamartQueryService.applyPaging(any(), any()))
            .thenReturn(query.getQuery());

        when(datamartApiClient.executeQuery(any()))
            .thenReturn(page1)
            .thenReturn(page2);

        when(blobStorageService.uploadFile(any(Path.class)))
            .thenReturn("https://storage/test.zip");

        service.process(queuedJob);

        verify(datamartApiClient, times(2))
            .executeQuery(any());

        verify(datamartQueryService, times(2))
            .applyPaging(any(), any());
    }


    @Test
    void process_BlobUploadFails_ExceptionPropagates() throws Exception {

        JsonNode response = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [
                    { "ID": 1 }
                ],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """);

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery("query { daily_weathers { items { ID } } }");

        DownloadJobMessage job = new DownloadJobMessage();
        job.setJobId("job-123");
        job.setEmailAddress("user@test.com");
        job.setStartDate("2022-08-01");
        job.setEndDate("2022-09-01");
        job.setQueries(List.of(query));

        QueuedDownloadJob queuedJob = new QueuedDownloadJob();
        queuedJob.setJob(job);

        when(datamartQueryService.applyPaging(any(), any()))
            .thenReturn(query.getQuery());

        when(datamartApiClient.executeQuery(any()))
            .thenReturn(response);

        when(blobStorageService.uploadFile(any(Path.class)))
            .thenThrow(new RuntimeException("Blob upload failure"));

        assertThrows(
            RuntimeException.class,
            () -> service.process(queuedJob));

        verify(emailService, never())
            .sendDownloadReadyEmail(any(), any());
    }

    @Test
    void process_EmailFails_ExceptionPropagates() throws Exception {

        JsonNode response = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [
                    { "ID": 1 }
                ],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """);

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery("query { daily_weathers { items { ID } } }");

        DownloadJobMessage job = new DownloadJobMessage();
        job.setJobId("job-123");
        job.setEmailAddress("user@test.com");
        job.setStartDate("2022-08-01");
        job.setEndDate("2022-09-01");
        job.setQueries(List.of(query));

        QueuedDownloadJob queuedJob = new QueuedDownloadJob();
        queuedJob.setJob(job);

        when(datamartQueryService.applyPaging(any(), any()))
            .thenReturn(query.getQuery());

        when(datamartApiClient.executeQuery(any()))
            .thenReturn(response);

        when(blobStorageService.uploadFile(any(Path.class)))
            .thenReturn("https://storage/test.zip");

        doThrow(new RuntimeException("Email failure"))
            .when(emailService)
            .sendDownloadReadyEmail(any(), any());

        assertThrows(
            RuntimeException.class,
            () -> service.process(queuedJob));
    }

    @Test
    void process_InvalidGraphQl_ThrowsInvalidQueryException() throws Exception {

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery(
            "query { daily_weathers { items { INVALID_FIELD } } }");

        DownloadJobMessage job = new DownloadJobMessage();
        job.setJobId("job-123");
        job.setEmailAddress("user@test.com");
        job.setStartDate("2022-08-01");
        job.setEndDate("2022-09-01");
        job.setQueries(List.of(query));

        QueuedDownloadJob queuedJob = new QueuedDownloadJob();
        queuedJob.setJob(job);

        HttpClientErrorException exception =
            HttpClientErrorException.BadRequest.create(
                "Bad Request",
                org.springframework.http.HttpStatus.BAD_REQUEST,
                "Bad Request",
                org.springframework.http.HttpHeaders.EMPTY,
                """
                {
                "errors": [
                    {
                    "message": "Field INVALID_FIELD does not exist."
                    }
                ]
                }
                """.getBytes(),
                java.nio.charset.StandardCharsets.UTF_8);

        when(datamartQueryService.applyPaging(any(), any()))
            .thenReturn(query.getQuery());

        when(datamartApiClient.executeQuery(any()))
            .thenThrow(exception);

        when(datamartQueryService.extractGraphQlError(any()))
            .thenReturn("Field INVALID_FIELD does not exist.");

        InvalidQueryException thrown =
            assertThrows(
                InvalidQueryException.class,
                () -> service.process(queuedJob));

        assertTrue(
            thrown.getMessage()
                .contains("INVALID_FIELD"));

        verify(blobStorageService, never())
            .uploadFile(any());

        verify(emailService, never())
            .sendDownloadReadyEmail(any(), any());
    }




}