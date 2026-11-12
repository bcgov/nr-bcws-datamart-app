package ca.bc.gov.bcws.nrs.downloadapi.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueuedDownloadJob {

    private String messageId;
    private String popReceipt;
    private Long dequeueCount;
    private DownloadJobMessage job;

}
