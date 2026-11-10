package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class NotifyEmailService implements EmailService {

    private static final Logger logger =
        LoggerFactory.getLogger(NotifyEmailService.class);

   

    private final RestClient restClient;

    @Value("${bc.notify.api-key}")
    private String apiKey;

    @Value("${bc.notify.email-endpoint}")
    private String emailEndpoint;

    @Value("${bc.notify.templates.download-success}")
    private String downloadSuccessTemplateId;

    @Value("${bc.notify.templates.download-failure}")
    private String downloadFailureTemplateId;

    @Value("${bc.notify.admin-email}")
    private String adminEmail;

    public NotifyEmailService(RestClient restClient) {
        this.restClient = restClient;
    }

    @Override
    public void sendDownloadReadyEmail(
            String emailAddress,
            String downloadLink) {

        var request = Map.of(
            "recipients", Map.of(
                "to", List.of(emailAddress)
            ),
            "content", Map.of(
                "templateId", downloadSuccessTemplateId
            ),
            "params", Map.of(
                "downloadLink", downloadLink
            )
        );

        logger.info(
            "Sending success email to {}",
            emailAddress);

        restClient.post()
            .uri(emailEndpoint)
            .header("X-API-KEY", apiKey)
            .body(request)
            .retrieve()
            .toBodilessEntity();
    }

    @Override
    public void sendDownloadFailedEmail(
            String emailAddress,
            String reason) {

        var request = Map.of(
            "recipients", Map.of(
                "to", List.of(emailAddress)
            ),
            "content", Map.of(
                "templateId", downloadFailureTemplateId
            ),
            "params", Map.of(
                "reason", reason
            )
        );

        logger.info(
            "Sending failure email to {}",
            emailAddress);

        restClient.post()
            .uri(emailEndpoint)
            .header("X-API-KEY", apiKey)
            .body(request)
            .retrieve()
            .toBodilessEntity();
    }

    @Override
    public void sendAdminFailureEmail(String reason) {

        logger.error("ADMIN ALERT - DOWNLOAD JOB FAILED\n{}", reason);

        if (adminEmail == null || adminEmail.isBlank()) {
            return;
        }

        sendDownloadFailedEmail(adminEmail, reason);
    }
}