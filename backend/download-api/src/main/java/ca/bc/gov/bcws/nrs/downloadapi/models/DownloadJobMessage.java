package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DownloadJobMessage {

    private String jobId;
    private List<DownloadQuery> queries;
    private String startDate;
    private String endDate;
    private String emailAddress;

}