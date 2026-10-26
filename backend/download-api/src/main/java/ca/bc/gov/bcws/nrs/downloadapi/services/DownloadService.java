package ca.bc.gov.bcws.nrs.downloadapi.services;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import ca.bc.gov.bcws.nrs.downloadapi.clients.DatamartApiClient;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadQuery;
import ca.bc.gov.bcws.nrs.downloadapi.models.DownloadRequest;
import ca.bc.gov.bcws.nrs.downloadapi.utils.Utils;


@Service
public class DownloadService {

    private final DatamartApiClient datamartApiClient;
    private final CsvService csvService;
    private final ZipService zipService;

    public DownloadService(
            DatamartApiClient datamartApiClient,
            CsvService csvService,
            ZipService zipService) {

        this.datamartApiClient = datamartApiClient;
        this.csvService = csvService;
        this.zipService = zipService;
    }

    public byte[] createDownload(DownloadRequest request) throws IOException {

        Map<String, byte[]> csvFiles = new HashMap<>();

        boolean hasDaily = false;
        boolean hasHourly = false;

        for (DownloadQuery downloadQuery : request.getQueries()) {

            String queryName = downloadQuery.getName().toLowerCase();

            if (queryName.contains("daily"))
                hasDaily = true;

            if (queryName.contains("hourly"))
                hasHourly = true;

            JsonNode response = datamartApiClient.executeQuery(downloadQuery.getQuery());

            JsonNode items = response.path("data").elements().next().path("items");

            byte[] csv = csvService.generateCsv(items);

            csvFiles.put(
                    String.format(
                            "bcws-weather-datamart-%s.csv",
                            downloadQuery.getName()),
                    csv);
        }

        String suffix = determineSuffix(hasDaily, hasHourly);

        String zipFileName = String.format(
                "bcws-weather-datamart-%s_%s.zip",
                suffix,
                Utils.generateGuid());

        return zipService.createZip(csvFiles);
    }


    private String determineSuffix(boolean hasDaily, boolean hasHourly) {

        if (hasDaily && hasHourly)
            return "daily-hourly";

        if (hasDaily)
            return "daily";

        if (hasHourly)
            return "hourly";

        return "download";
    }
}