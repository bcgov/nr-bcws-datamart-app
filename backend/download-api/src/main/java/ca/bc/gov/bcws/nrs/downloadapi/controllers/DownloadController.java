package ca.bc.gov.bcws.nrs.downloadapi.controllers;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.services.DownloadService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @PostMapping
    public ResponseEntity<byte[]> createDownload(@RequestBody DownloadRequest request)throws IOException {

        byte[] zip = downloadService.createDownload(request);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"bcws-weather-datamart.zip\"")
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(zip);
    }
}
