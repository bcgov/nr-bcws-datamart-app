package ca.bc.gov.bcws.nrs.downloadapi.controllers;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadFile;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadJobResponse;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.services.DownloadService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.HttpHeaders;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @PostMapping
    public ResponseEntity<?> createDownload(@RequestBody DownloadRequest request)throws IOException {

        if (request.isEmailDownload()) {

            DownloadJobResponse response = downloadService.submitDownloadJob(request);

            return ResponseEntity.accepted().body(response);
        }

        DownloadFile downloadFile = downloadService.createDownload(request);

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" +
                            downloadFile.getFileName() +
                            "\"")
                .body(downloadFile.getContent());

    }
}
