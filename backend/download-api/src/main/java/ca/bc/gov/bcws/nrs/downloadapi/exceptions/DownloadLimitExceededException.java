package ca.bc.gov.bcws.nrs.downloadapi.exceptions;

public class DownloadLimitExceededException extends RuntimeException {

    public DownloadLimitExceededException(int maxRows) {
        super(
                "Download exceeds the maximum synchronous limit of "
                        + maxRows
                        + " rows. Please request an email download instead.");
    }
}