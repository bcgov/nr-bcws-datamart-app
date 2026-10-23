package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;

public class DownloadRequest {

    private List<DownloadQuery> queries;
    private String emailAddress;
    private boolean emailDownload;

    public List<DownloadQuery> getQueries() {
        return queries;
    }

    public void setQueries(List<DownloadQuery> queries) {
        this.queries = queries;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public boolean isEmailDownload() {
        return emailDownload;
    }

    public void setEmailDownload(boolean emailDownload) {
        this.emailDownload = emailDownload;
    }
}