package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadResponse;
import ca.bc.gov.bcws.nrs.downloadapi.models.QueryResult;

@Service
public class DownloadService {

    private final DatamartApiClient datamartApiClient;

    public DownloadService(DatamartApiClient datamartApiClient) {
        this.datamartApiClient = datamartApiClient;
    }

    public DownloadResponse createDownload(DownloadRequest request) {

        List<QueryResult> results = new ArrayList<>();

        for (DownloadQuery downloadQuery : request.getQueries()) {

            JsonNode response = datamartApiClient.executeQuery(downloadQuery.getQuery());

            QueryResult result = new QueryResult();

            result.setName(downloadQuery.getName());
            result.setResponse(response);

            results.add(result);
        }

        DownloadResponse downloadResponse = new DownloadResponse();

        downloadResponse.setRequestId(UUID.randomUUID());
        downloadResponse.setStatus("COMPLETE");
        downloadResponse.setResults(results);

        return downloadResponse;
    }
}