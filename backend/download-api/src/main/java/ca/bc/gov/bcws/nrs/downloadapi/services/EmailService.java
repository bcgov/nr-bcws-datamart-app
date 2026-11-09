package ca.bc.gov.bcws.nrs.downloadapi.services;

public interface EmailService {

    void sendDownloadReadyEmail(
        String emailAddress,
        String downloadLink);

    void sendDownloadFailedEmail(
        String emailAddress,
        String reason);
}