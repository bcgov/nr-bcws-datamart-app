package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DownloadRequest {

    private List<DownloadQuery> queries;
    private String emailAddress;
    private boolean emailDownload;
    private String startDate;
    private String endDate;

}