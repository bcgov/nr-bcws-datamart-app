package ca.bc.gov.bcws.nrs.downloadapi.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DownloadFile {

    private String fileName;
    private byte[] content;

}