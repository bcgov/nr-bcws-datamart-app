package ca.bc.gov.bcws.nrs.downloadapi.services;


import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedWriter;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.databind.JsonNode;


import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueuedDownloadJob;
import ca.bc.gov.bcws.nrs.downloadapi.utils.Utils;


@Service
public class DownloadJobProcessorService {

    private static final Logger logger = LoggerFactory.getLogger(DownloadJobProcessorService.class);

    private final DatamartApiClient datamartApiClient;
    private final CsvService csvService;
    private final DatamartQueryService datamartQueryService;
    private final ZipService zipService;
    private final BlobStorageService blobStorageService;
    private final EmailService emailService;

    public DownloadJobProcessorService(
        DatamartApiClient datamartApiClient,
        CsvService csvService,
        DatamartQueryService datamartQueryService,
        ZipService zipService,
        BlobStorageService blobStorageService,
        EmailService emailService) {

        this.datamartApiClient = datamartApiClient;
        this.csvService = csvService;
        this.datamartQueryService = datamartQueryService;
        this.zipService = zipService;
        this.blobStorageService = blobStorageService;
        this.emailService = emailService;
    }

    public void process(QueuedDownloadJob queuedJob) {

        Path workingDirectory = null;

        try {

            logger.info(
                "Processing job {} for {}",
                queuedJob.getJob().getJobId(),
                queuedJob.getJob().getEmailAddress());

            workingDirectory = Files.createTempDirectory("download-job-" + queuedJob.getJob().getJobId());

            logger.info( "Created working directory {}",workingDirectory);

            List<Path> csvFiles = new ArrayList<>();

            boolean hasDaily = false;
            boolean hasHourly = false;

            for (var query : queuedJob.getJob().getQueries()) {

                String queryName = query.getName().toLowerCase();

                if (queryName.contains("daily"))
                    hasDaily = true;

                if (queryName.contains("hourly"))
                    hasHourly = true;
                            

                String fileName = Utils.generateCsvFileName(queryName, queuedJob.getJob().getStartDate(), queuedJob.getJob().getEndDate());
                
                Path csvFile = generateCsvFile(query.getQuery(), fileName, workingDirectory);

                csvFiles.add(csvFile);

                logger.info("Completed query {} to {}", queryName, csvFile);

            }

            String zipFileName = Utils.generateZipFileName(
                Utils.determineSuffix(hasDaily, hasHourly),
                queuedJob.getJob().getStartDate(),
                queuedJob.getJob().getEndDate());

            Path zipFile = workingDirectory.resolve(zipFileName);

            zipService.createZipFile(csvFiles, zipFile);

            logger.info("Created ZIP file {} ({} bytes) containing {} CSV files", zipFile, Files.size(zipFile), csvFiles.size());

            String downloadUrl = blobStorageService.uploadFile(zipFile);

            logger.info("Uploaded ZIP {}. Download URL: {}", zipFile.getFileName(), downloadUrl);

            emailService.sendDownloadReadyEmail(queuedJob.getJob().getEmailAddress(), downloadUrl);

            logger.info("Sent download email for job {}", queuedJob.getJob().getJobId());

        } catch (IOException e) {

            logger.error(
                "Failed processing job {} due to file system error",
                queuedJob.getJob().getJobId(),
                e);

            if (queuedJob.getJob().getEmailAddress() != null && !queuedJob.getJob().getEmailAddress().isBlank()) {

                emailService.sendDownloadFailedEmail(queuedJob.getJob().getEmailAddress(), e.getMessage());
                }

            throw new IllegalStateException(
                "Failed processing download job",
                e);
        } finally {
            if (workingDirectory != null) {
                deleteDirectory(workingDirectory);
            }
        }
    }


    private Path generateCsvFile(
        String query,
        String fileName,
        Path workingDirectory)
        throws IOException {

        Path csvFile = workingDirectory.resolve(fileName);

        try (BufferedWriter writer = Files.newBufferedWriter(csvFile)) {

            String cursor = null;
            boolean hasNextPage;
            boolean writeHeaders = true;
            int pageNumber = 1;
            int rowCount = 0;

            do {

                String pagedQuery = datamartQueryService.applyPaging(query, cursor);

                JsonNode response;

                try {

                    response = datamartApiClient.executeQuery(pagedQuery);

                } catch (HttpClientErrorException.BadRequest ex) {

                    String message = datamartQueryService.extractGraphQlError(ex.getResponseBodyAsString());

                    logger.warn(
                        "GraphQL query failed: {}",
                        message);

                    throw new InvalidQueryException(message);
                }

                JsonNode connection = response.path("data").elements().next();

                JsonNode items = connection.path("items");

                csvService.appendRows(
                    items,
                    writer,
                    writeHeaders);

                writeHeaders = false;

                rowCount += items.size();

                logger.info(
                    "CSV page {} wrote {} rows",
                    pageNumber,
                    items.size());

                hasNextPage = connection.path("hasNextPage").asBoolean();

                cursor = connection.path("endCursor").asText();

                pageNumber++;

            } while (hasNextPage);
            
            logger.info(
                "Created CSV {} with {} total rows",
                csvFile,
                rowCount);

            return csvFile;
        }   
    }


    


    private void deleteDirectory(Path directory) {

        try {

            Files.walk(directory)
                .sorted((a, b) -> b.compareTo(a))
                .forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        logger.warn(
                            "Failed deleting temporary file {}",
                            path,
                            e);
                    }
                });

            logger.info(
                "Removed working directory {}",
                directory);

        } catch (IOException e) {

            logger.warn(
                "Failed cleaning working directory {}",
                directory,
                e);
        }
    }


}