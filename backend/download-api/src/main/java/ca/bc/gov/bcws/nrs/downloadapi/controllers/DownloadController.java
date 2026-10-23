package ca.bc.gov.bcws.nrs.downloadapi.controllers;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/downloads")
public class DownloadController {

    @PostMapping
    public ResponseEntity<DownloadResponse> createDownload(
            @RequestBody DownloadRequest request) {

        DownloadResponse response = new DownloadResponse();


        return ResponseEntity.ok(response);
    }
}