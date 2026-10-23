package ca.bc.gov.bcws.nrs.downloadapi.controllers;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadResponse;
import ca.bc.gov.bcws.nrs.downloadapi.services.DownloadService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @PostMapping
    public ResponseEntity<DownloadResponse> createDownload(@RequestBody DownloadRequest request) {

        return ResponseEntity.ok(downloadService.createDownload(request));
    }
}
