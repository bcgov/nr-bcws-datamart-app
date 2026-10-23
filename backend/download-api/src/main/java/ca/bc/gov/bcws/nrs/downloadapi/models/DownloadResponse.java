package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.UUID;

public class DownloadResponse {

    private UUID requestId;
    private String status;
    private String message;
    
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
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

}