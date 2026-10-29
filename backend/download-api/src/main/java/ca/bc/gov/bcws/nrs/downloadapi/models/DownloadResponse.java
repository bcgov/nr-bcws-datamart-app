package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;
import java.util.UUID;

public class DownloadResponse {

    private UUID requestId;
    private String status;
    private List<QueryResult> results;

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<QueryResult> getResults() {
        return results;
    }

    public void setResults(List<QueryResult> results) {
        this.results = results;
    }
}
