package ca.bc.gov.bcws.nrs.downloadapi.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.HttpHeaders;

import ca.bc.gov.bcws.nrs.downloadapi.handlers.GlobalExceptionHandler;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadFile;
import ca.bc.gov.bcws.nrs.downloadapi.services.DownloadService;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.DownloadLimitExceededException;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;


@WebMvcTest(DownloadController.class)
@Import(GlobalExceptionHandler.class)
class DownloadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DownloadService downloadService;

    @Test
    void createDownload_ReturnsAttachmentResponse()
            throws Exception {

        DownloadFile file = new DownloadFile();
        file.setFileName("test.zip");
        file.setContent("test".getBytes());

        when(downloadService.createDownload(any()))
                .thenReturn(file);

        String requestBody = """
            {
              "queries":[
                {
                  "name":"daily-weather",
                  "query":"query { test }"
                }
              ],
              "startDate":"2022-08-01",
              "endDate":"2022-09-01",
              "emailDownload":false
            }
            """;

        mockMvc.perform(
                post("/api/downloads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(
                        header().string(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"test.zip\""));
    }

    @Test
    void createDownload_InvalidQuery_ReturnsBadRequest()
            throws Exception {

        when(downloadService.createDownload(any()))
                .thenThrow(
                        new InvalidQueryException(
                                "Invalid GraphQL query."));

        String requestBody = """
            {
            "queries":[
                {
                "name":"daily-weather",
                "query":"bad query"
                }
            ],
            "startDate":"2022-08-01",
            "endDate":"2022-09-01",
            "emailDownload":false
            }
            """;

        mockMvc.perform(
                post("/api/downloads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(
                        jsonPath("$.message")
                                .value("Invalid GraphQL query."));
    }

    @Test
    void createDownload_InvalidField_ReturnsBadRequest()
            throws Exception {

        String message =
                "The field `TEMPERATURE_MAAX` does not exist on the type `daily_weather`.";

        when(downloadService.createDownload(any()))
                .thenThrow(
                        new InvalidQueryException(message));

        String requestBody = """
            {
            "queries":[
                {
                "name":"daily-weather",
                "query":"query { daily_weathers { items { TEMPERATURE_MAAX } } }"
                }
            ],
            "startDate":"2022-08-01",
            "endDate":"2022-09-01",
            "emailDownload":false
            }
            """;

        mockMvc.perform(
                post("/api/downloads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(
                        jsonPath("$.message")
                                .value(message));
    }

    @Test
    void createDownload_RowLimitExceeded_ReturnsBadRequest()
            throws Exception {

        DownloadLimitExceededException exception =
                new DownloadLimitExceededException(10000);

        when(downloadService.createDownload(any()))
                .thenThrow(exception);

        String requestBody = """
            {
            "queries":[
                {
                "name":"daily-weather",
                "query":"query { daily_weathers { items { ID } } }"
                }
            ],
            "startDate":"2022-08-01",
            "endDate":"2022-09-01",
            "emailDownload":false
            }
            """;

        mockMvc.perform(
                post("/api/downloads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(
                        jsonPath("$.message")
                                .exists());
    }
}