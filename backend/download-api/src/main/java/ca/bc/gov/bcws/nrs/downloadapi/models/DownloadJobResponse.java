package ca.bc.gov.bcws.nrs.downloadapi.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DownloadJobResponse {

    private String jobId;
    private String status;
    private String message;

}