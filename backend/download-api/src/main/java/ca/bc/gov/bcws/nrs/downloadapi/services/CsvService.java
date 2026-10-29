package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

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

    private String escape(String value) {

        if (value.contains(",") || value.contains("\"") || value.contains("\n"))
            return "\"" + value.replace("\"", "\"\"") + "\"";

        return value;
    }
}