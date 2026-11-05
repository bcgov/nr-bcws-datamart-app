package ca.bc.gov.bcws.nrs.downloadapi.services;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.beans.factory.annotation.Value;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadFile;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobMessage;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobResponse;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.utils.Utils;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.DownloadLimitExceededException;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;


@Service
public class DownloadService {
    private static final Logger logger = LoggerFactory.getLogger(DownloadService.class);

    private final DatamartApiClient datamartApiClient;
    private final CsvService csvService;
    private final ZipService zipService;
    private final QueueService queueService;
    private final DatamartQueryService datamartQueryService;

    @Value("${download.sync-threshold:10000}")
    private int maxSyncRows;

    public DownloadService(
            DatamartApiClient datamartApiClient,
            CsvService csvService,
            ZipService zipService,
            QueueService queueService,
            DatamartQueryService datamartQueryService) {

        this.datamartApiClient = datamartApiClient;
        this.csvService = csvService;
        this.zipService = zipService;
        this.queueService = queueService;
        this.datamartQueryService = datamartQueryService;
    }

    public DownloadFile createDownload(DownloadRequest request) throws IOException {
        logger.info("Received download request. Query count: {}, Date range: {} to {}",
        request.getQueries().size(),
        request.getStartDate(),
        request.getEndDate());

        Map<String, byte[]> csvFiles = new HashMap<>();

        boolean hasDaily = false;
        boolean hasHourly = false;
        int totalRows = 0;

        for (DownloadQuery downloadQuery : request.getQueries()) {

            String queryName = downloadQuery.getName().toLowerCase();

            if (queryName.contains("daily"))
                hasDaily = true;

            if (queryName.contains("hourly"))
                hasHourly = true;

            logger.info("Processing download query '{}'", downloadQuery.getName());

            JsonNode items = fetchAllItems(downloadQuery.getQuery());

            totalRows += items.size();

            if (totalRows > maxSyncRows) {

                logger.warn(
                    "Download exceeded synchronous row limit. Total rows processed: {}, limit: {}",
                    totalRows,
                    maxSyncRows);

                throw new DownloadLimitExceededException(maxSyncRows);
            }

            logger.info("Query '{}' returned {} rows (running total: {})",
                downloadQuery.getName(),
                items.size(),
                totalRows);

            byte[] csv = csvService.generateCsv(items);

            csvFiles.put(Utils.generateCsvFileName(downloadQuery.getName(), request.getStartDate(), request.getEndDate()), csv);
        }

        String suffix = Utils.determineSuffix(hasDaily, hasHourly);

        String zipFileName = Utils.generateZipFileName(suffix, request.getStartDate(),request.getEndDate());

        DownloadFile downloadFile = new DownloadFile();

        downloadFile.setFileName(zipFileName);

        downloadFile.setContent(zipService.createZip(csvFiles));

        logger.info("Created download '{}' containing {} file(s)",
            zipFileName,
            csvFiles.size());

        return downloadFile;
    }


    private JsonNode fetchAllItems(String query) {
        logger.info("Original GraphQL query: {}", query);

        ArrayNode allItems = new ObjectMapper().createArrayNode();

        String cursor = null;

        boolean hasNextPage;

        int pageNumber = 1;
        int queryRowCount = 0;

        do {

            String pagedQuery = datamartQueryService.applyPaging(query, cursor);

            JsonNode response;

            try {

                response = datamartApiClient.executeQuery(pagedQuery);

            } catch (HttpClientErrorException.BadRequest ex) {

                String message = datamartQueryService.extractGraphQlError(ex.getResponseBodyAsString());

                logger.warn("GraphQL query failed: {}", message);

                throw new InvalidQueryException(message);
            }


            JsonNode connection = response.path("data").elements().next();

            JsonNode items = connection.path("items");

            for (JsonNode item : items) {

                allItems.add(item);
                queryRowCount++;

                    
            }

            logger.info("Page {} returned {} rows (query total: {})",
                pageNumber,
                items.size(),
                queryRowCount);

            hasNextPage = connection.path("hasNextPage").asBoolean();


            cursor = connection.path("endCursor").asText();

            pageNumber++;

        } while (hasNextPage);

        logger.info("Completed download query. Total rows fetched: {}",queryRowCount);

        return allItems;
    }

   


    public DownloadJobResponse submitDownloadJob(DownloadRequest request) {

        if (request.getEmailAddress() == null || request.getEmailAddress().isBlank()) {
            throw new IllegalArgumentException(
                    "Email address is required for email downloads.");
        }

        if (request.getQueries() == null || request.getQueries().isEmpty()) {
            throw new IllegalArgumentException(
                "At least one query is required.");
        }

        String jobId = UUID.randomUUID().toString();

        DownloadJobMessage message = createJobMessage(request, jobId);

        queueService.enqueue(message);

        logger.info(
            "Queued download job {} for {} with {} query(s)",
            jobId,
            request.getEmailAddress(),
            request.getQueries().size());

        DownloadJobResponse response = new DownloadJobResponse();

        response.setJobId(jobId);
        response.setStatus("ACCEPTED");
        response.setMessage(
                "Download request accepted and queued for processing.");

        return response;
    }

    private DownloadJobMessage createJobMessage(DownloadRequest request, String jobId) {

        DownloadJobMessage message = new DownloadJobMessage();

        message.setJobId(jobId);
        message.setQueries(request.getQueries());
        message.setStartDate(request.getStartDate());
        message.setEndDate(request.getEndDate());
        message.setEmailAddress(request.getEmailAddress());

        return message;
    }
}