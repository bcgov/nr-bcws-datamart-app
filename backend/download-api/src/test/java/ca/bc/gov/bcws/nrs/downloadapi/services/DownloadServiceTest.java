package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.DownloadLimitExceededException;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadFile;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;

@ExtendWith(MockitoExtension.class)
class DownloadServiceTest {

    @Mock
    private DatamartApiClient datamartApiClient;

    @Mock
    private CsvService csvService;

    @Mock
    private ZipService zipService;

    @InjectMocks
    private DownloadService downloadService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createDownload_SinglePageSuccess_ReturnsDownloadFile() throws IOException {

        String graphqlResponse = """
            {
              "data": {
                "daily_weathers": {
                  "items": [
                    {
                      "STATION_NAME": "PRINCE RUPERT (EC)",
                      "TEMPERATURE": 13.7
                    }
                  ],
                  "hasNextPage": false,
                  "endCursor": null
                }
              }
            }
            """;

        JsonNode responseNode = objectMapper.readTree(graphqlResponse);

        byte[] csvBytes = "test-csv".getBytes();
        byte[] zipBytes = "test-zip".getBytes();

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery(
                "query { daily_weathers { items { STATION_NAME TEMPERATURE } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(query));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailAddress("cody.bergin@gov.bc.ca");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(responseNode);

        when(csvService.generateCsv(any()))
                .thenReturn(csvBytes);

        when(zipService.createZip(any()))
                .thenReturn(zipBytes);

        DownloadFile result =
                downloadService.createDownload(request);

        verify(datamartApiClient, times(1))
                .executeQuery(any());

        verify(csvService, times(1))
                .generateCsv(any());

        verify(zipService, times(1))
                .createZip(any());

        assertArrayEquals(zipBytes, result.getContent());

        assertTrue(result.getFileName().contains("daily"));
    }

    @Test
    void createDownload_MultiplePages_MergesAllResults() throws IOException {

        JsonNode page1 = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [
                    { "ID": 1 },
                    { "ID": 2 }
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
                    { "ID": 3 }
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

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(query));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(page1)
                .thenReturn(page2);

        when(csvService.generateCsv(any()))
                .thenReturn("csv".getBytes());

        when(zipService.createZip(any()))
                .thenReturn("zip".getBytes());

        downloadService.createDownload(request);

        verify(datamartApiClient, times(2))
                .executeQuery(any());

        ArgumentCaptor<JsonNode> captor =
                ArgumentCaptor.forClass(JsonNode.class);

        verify(csvService)
                .generateCsv(captor.capture());

        JsonNode mergedItems = captor.getValue();

        assertEquals(3, mergedItems.size());
    }

    @Test
    void createDownload_InvalidGraphQl_ThrowsInvalidQueryException() {

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery(
                "query { daily_weathers(filter: { dsagasEC } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(query));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        assertThrows(
                InvalidQueryException.class,
                () -> downloadService.createDownload(request));

        verify(datamartApiClient, times(0))
                .executeQuery(any());
    }

    @Test
    void createDownload_InvalidField_ThrowsInvalidQueryException() {

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery(
                "query { daily_weathers { items { TEMPERATURE_MAAX } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(query));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        HttpClientErrorException exception =
        HttpClientErrorException.BadRequest.create(
                "Bad Request",
                org.springframework.http.HttpStatus.BAD_REQUEST,
                "Bad Request",
                HttpHeaders.EMPTY,
                """
                {
                  "errors": [
                    {
                      "message": "The field `TEMPERATURE_MAAX` does not exist on the type `daily_weather`."
                    }
                  ]
                }
                """.getBytes(),
                StandardCharsets.UTF_8);

        when(datamartApiClient.executeQuery(any()))
                .thenThrow(exception);

        InvalidQueryException thrown =
                assertThrows(
                        InvalidQueryException.class,
                        () -> downloadService.createDownload(request));

        assertTrue(
                thrown.getMessage().contains("TEMPERATURE_MAAX"));
    }


    @Test
    void createDownload_DailyAndHourly_CreatesDailyHourlyZipName() throws IOException {

        JsonNode responseNode = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """);

        DownloadQuery daily = new DownloadQuery();
        daily.setName("daily-weather");
        daily.setQuery("query { daily_weathers { items { ID } } }");

        DownloadQuery hourly = new DownloadQuery();
        hourly.setName("hourly-weather");
        hourly.setQuery("query { daily_weathers { items { ID } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(daily, hourly));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(responseNode);

        when(csvService.generateCsv(any()))
                .thenReturn("csv".getBytes());

        when(zipService.createZip(any()))
                .thenReturn("zip".getBytes());

        DownloadFile result =
                downloadService.createDownload(request);

        assertTrue(
                result.getFileName().contains("daily-hourly"));
    }

    @Test
    void createDownload_MultipleQueries_CreatesTwoCsvFiles() throws IOException {

        JsonNode responseNode = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """);

        DownloadQuery daily = new DownloadQuery();
        daily.setName("daily-weather");
        daily.setQuery("query { daily_weathers { items { ID } } }");

        DownloadQuery hourly = new DownloadQuery();
        hourly.setName("hourly-weather");
        hourly.setQuery("query { daily_weathers { items { ID } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(daily, hourly));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(responseNode);

        when(csvService.generateCsv(any()))
                .thenReturn("csv".getBytes());

        when(zipService.createZip(any()))
                .thenReturn("zip".getBytes());

        downloadService.createDownload(request);

        verify(csvService, times(2))
                .generateCsv(any());

        verify(zipService, times(1))
                .createZip(any());
    }

    @Test
    void createDownload_SingleQueryExceedsRowLimit_ThrowsDownloadLimitExceededException()
            throws IOException {

        StringBuilder itemsBuilder = new StringBuilder();

        for (int i = 1; i <= 10001; i++) {

            if (i > 1) {
                itemsBuilder.append(",");
            }

            itemsBuilder.append("""
                {
                "ID": %d
                }
                """.formatted(i));
        }

        String responseJson = """
            {
            "data": {
                "daily_weathers": {
                "items": [
                    %s
                ],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """.formatted(itemsBuilder);

        JsonNode responseNode = objectMapper.readTree(responseJson);

        DownloadQuery query = new DownloadQuery();
        query.setName("daily-weather");
        query.setQuery("query { daily_weathers { items { ID } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(query));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(responseNode);

        assertThrows(
                DownloadLimitExceededException.class,
                () -> downloadService.createDownload(request));

        verify(datamartApiClient, times(1))
                .executeQuery(any());
    }

    @Test
    void createDownload_MultipleQueriesExceedCombinedRowLimit_ThrowsDownloadLimitExceededException()
            throws IOException {

        StringBuilder dailyItems = new StringBuilder();

        for (int i = 1; i <= 5001; i++) {

            if (i > 1) {
                dailyItems.append(",");
            }

            dailyItems.append("""
                {
                "ID": %d
                }
                """.formatted(i));
        }

        JsonNode dailyResponse = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [%s],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """.formatted(dailyItems));

        StringBuilder hourlyItems = new StringBuilder();

        for (int i = 5002; i <= 10001; i++) {

            if (i > 5002) {
                hourlyItems.append(",");
            }

            hourlyItems.append("""
                {
                "ID": %d
                }
                """.formatted(i));
        }

        JsonNode hourlyResponse = objectMapper.readTree("""
            {
            "data": {
                "daily_weathers": {
                "items": [%s],
                "hasNextPage": false,
                "endCursor": null
                }
            }
            }
            """.formatted(hourlyItems));

        DownloadQuery daily = new DownloadQuery();
        daily.setName("daily-weather");
        daily.setQuery("query { daily_weathers { items { ID } } }");

        DownloadQuery hourly = new DownloadQuery();
        hourly.setName("hourly-weather");
        hourly.setQuery("query { daily_weathers { items { ID } } }");

        DownloadRequest request = new DownloadRequest();
        request.setQueries(List.of(daily, hourly));
        request.setStartDate("2022-08-01");
        request.setEndDate("2022-09-01");
        request.setEmailDownload(false);

        when(datamartApiClient.executeQuery(any()))
                .thenReturn(dailyResponse)
                .thenReturn(hourlyResponse);

        assertThrows(
                DownloadLimitExceededException.class,
                () -> downloadService.createDownload(request));

        verify(datamartApiClient, times(2))
                .executeQuery(any());
    }
}