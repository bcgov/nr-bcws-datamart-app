package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadResponse;

@Service
public class DownloadService {

    public DownloadResponse createDownload(DownloadRequest request) {

        DownloadResponse response = new DownloadResponse();

       
       
        response.setRequestId(UUID.randomUUID());
        response.setStatus("ACCEPTED");
        response.setMessage(
            String.format(
                "Received %d queries",
                request.getQueries().size()));

        return response;
    }
}