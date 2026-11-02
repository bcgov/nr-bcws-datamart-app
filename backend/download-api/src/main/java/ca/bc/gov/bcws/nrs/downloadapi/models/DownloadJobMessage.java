package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;

public class DownloadJobMessage {

    private String jobId;

    private List<DownloadQuery> queries;

    private String startDate;

    private String endDate;

    private String emailAddress;

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public List<DownloadQuery> getQueries() {
        return queries;
    }

    public void setQueries(List<DownloadQuery> queries) {
        this.queries = queries;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }



   
}