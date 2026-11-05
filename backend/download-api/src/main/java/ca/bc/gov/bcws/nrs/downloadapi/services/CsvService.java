package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.io.BufferedWriter;
import java.util.ArrayList;
import java.util.List;

import java.nio.file.Files;
import java.nio.file.Path;


import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class CsvService {

    public byte[] generateCsv(JsonNode items) throws IOException {

        if (items == null || !items.isArray() || items.isEmpty()){
            return new byte[0];
        }
            
        StringWriter writer = new StringWriter();

        List<String> headers = new ArrayList<>();

        items.get(0).fieldNames().forEachRemaining(headers::add);

        writer.append(String.join(",", headers)).append("\n");

        for (JsonNode row : items) {

            List<String> values = new ArrayList<>();

            for (String header : headers)
                values.add(escape(row.path(header).asText("")));

            writer.append(String.join(",", values)).append("\n");
        }

        return writer.toString().getBytes(StandardCharsets.UTF_8);
    }

    public void appendRows(JsonNode items, BufferedWriter writer, boolean writeHeaders)
            throws IOException {

        if (items == null || !items.isArray() || items.isEmpty()) {
            return;
        }

        List<String> headers = new ArrayList<>();

        items.get(0).fieldNames().forEachRemaining(headers::add);

        if (writeHeaders) {
            writer.write(String.join(",", headers));
            writer.newLine();
        }

        for (JsonNode row : items) {

            List<String> values = new ArrayList<>();

            for (String header : headers) {
                values.add(escape(row.path(header).asText("")));
            }

            writer.write(String.join(",", values));
            writer.newLine();
        }

        writer.flush();
    }

    private String escape(String value) {

        if (value.contains(",") || value.contains("\"") || value.contains("\n"))
            return "\"" + value.replace("\"", "\"\"") + "\"";

        return value;
    }
}