package ca.bc.gov.bcws.nrs.downloadapi.services;


import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadFile;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.utils.Utils;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.DownloadLimitExceededException;
import ca.bc.gov.bcws.nrs.downloadapi.exceptions.InvalidQueryException;
import graphql.language.Argument;
import graphql.language.Selection;
import graphql.language.Document;
import graphql.language.Field;
import graphql.language.IntValue;
import graphql.language.OperationDefinition;
import graphql.language.StringValue;
import graphql.parser.Parser;
import graphql.language.AstPrinter;

@Service
public class DownloadService {
    private static final Logger logger = LoggerFactory.getLogger(DownloadService.class);

    private final DatamartApiClient datamartApiClient;
    private final CsvService csvService;
    private final ZipService zipService;

    private static final int PAGE_SIZE = 1000;
    private static final int MAX_SYNC_ROWS = 10000;

    public DownloadService(
            DatamartApiClient datamartApiClient,
            CsvService csvService,
            ZipService zipService) {

        this.datamartApiClient = datamartApiClient;
        this.csvService = csvService;
        this.zipService = zipService;
    }

    public DownloadFile createDownload(DownloadRequest request) throws IOException {
        logger.info("Received download request. Query count: {}, Date range: {} to {}",
        request.getQueries().size(),
        request.getStartDate(),
        request.getEndDate());

        if (request.isEmailDownload())throw new IllegalArgumentException("Email downloads are not yet implemented.");

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

            if (totalRows > MAX_SYNC_ROWS) {

                logger.warn(
                    "Download exceeded synchronous row limit. Total rows processed: {}, limit: {}",
                    totalRows,
                    MAX_SYNC_ROWS);

                throw new DownloadLimitExceededException(MAX_SYNC_ROWS);
            }

            logger.info("Query '{}' returned {} rows (running total: {})",
                downloadQuery.getName(),
                items.size(),
                totalRows);

            byte[] csv = csvService.generateCsv(items);

            csvFiles.put( String.format(
                        "bcws-weather-datamart_%s_%s_%s.csv",
                        downloadQuery.getName(),
                        request.getStartDate(),
                        request.getEndDate()),
                csv);
        }

        String suffix = determineSuffix(hasDaily, hasHourly);

        String zipFileName = Utils.generateZipFileName(suffix, request.getStartDate(),request.getEndDate());

        DownloadFile downloadFile = new DownloadFile();

        downloadFile.setFileName(zipFileName);

        downloadFile.setContent(zipService.createZip(csvFiles));

        logger.info("Created download '{}' containing {} file(s)",
            zipFileName,
            csvFiles.size());

        return downloadFile;
    }


    private String determineSuffix(boolean hasDaily, boolean hasHourly) {

        if (hasDaily && hasHourly)
            return "daily-hourly";

        if (hasDaily)
            return "daily";

        if (hasHourly)
            return "hourly";

        return "download";
    }

    private JsonNode fetchAllItems(String query) {
        logger.info("Original GraphQL query: {}", query);

        ArrayNode allItems = new ObjectMapper().createArrayNode();

        String cursor = null;

        boolean hasNextPage;

        int pageNumber = 1;
        int queryRowCount = 0;

        do {

            String pagedQuery = applyPaging(query, cursor);

            JsonNode response;

            try {

                response = datamartApiClient.executeQuery(pagedQuery);

            } catch (HttpClientErrorException.BadRequest ex) {

                String message = extractGraphQlError(ex.getResponseBodyAsString());

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

    private String applyPaging(String query, String cursor) {

        Document document;

        try {
            document = Parser.parse(query);
        } catch (Exception e) {

            logger.warn("Invalid GraphQL query provided", e);

            throw new InvalidQueryException(
                    "Invalid GraphQL query.");
        }

        OperationDefinition operation = (OperationDefinition) document.getDefinitions().get(0);

        Field field = (Field) operation.getSelectionSet().getSelections().get(0);

        List<Argument> arguments = new ArrayList<>(field.getArguments());

        arguments.removeIf(arg ->
                "first".equals(arg.getName())
                        || "after".equals(arg.getName()));

        arguments.add(
                Argument.newArgument()
                        .name("first")
                        .value(IntValue.newIntValue(BigInteger.valueOf(PAGE_SIZE)).build())
                        .build());

        if (cursor != null)
            arguments.add(
                    Argument.newArgument()
                            .name("after")
                            .value(StringValue.newStringValue(cursor).build())
                            .build());

        List<Selection> selections = new ArrayList<>(field.getSelectionSet().getSelections());

        boolean hasNextPage = selections.stream()
                .filter(Field.class::isInstance)
                .map(Field.class::cast)
                .anyMatch(f -> "hasNextPage".equals(f.getName()));

        boolean hasEndCursor = selections.stream()
                .filter(Field.class::isInstance)
                .map(Field.class::cast)
                .anyMatch(f -> "endCursor".equals(f.getName()));

        if (!hasNextPage)
            selections.add(Field.newField("hasNextPage").build());

        if (!hasEndCursor)
            selections.add(Field.newField("endCursor").build());

        Field updatedField = field.transform(builder ->
                builder.arguments(arguments)
                        .selectionSet(
                                field.getSelectionSet()
                                        .transform(selectionBuilder ->
                                                selectionBuilder.selections(selections))));

        OperationDefinition updatedOperation = operation.transform(builder ->
                builder.selectionSet(
                        operation.getSelectionSet()
                                .transform(selectionBuilder ->
                                        selectionBuilder.selections(List.of(updatedField)))));

        Document updatedDocument = document.transform(builder ->
                builder.definitions(List.of(updatedOperation)));

        String updatedQuery = AstPrinter.printAst(updatedDocument);

        if (cursor == null) logger.info("Paged GraphQL query: {}", updatedQuery);

        return updatedQuery;
    }

    private String extractGraphQlError(String responseBody) {

        try {

            JsonNode response =
                    new ObjectMapper().readTree(responseBody);

            JsonNode errors = response.path("errors");

            if (errors.isArray() && !errors.isEmpty()) {

                return errors.get(0)
                        .path("message")
                        .asText("Invalid GraphQL query.");
            }

        } catch (Exception ignored) {
        }

        return "Invalid GraphQL query.";
    }
}