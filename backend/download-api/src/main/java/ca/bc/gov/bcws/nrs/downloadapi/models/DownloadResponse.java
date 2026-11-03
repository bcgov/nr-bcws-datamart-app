package ca.bc.gov.bcws.nrs.downloadapi.models;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DownloadResponse {

    private UUID requestId;
    private String status;
    private List<QueryResult> results;

}