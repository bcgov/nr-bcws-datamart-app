package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;




import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class CsvService {

    public byte[] generateCsv(JsonNode items) throws IOException {

        if (items == null || !items.isArray() || items.isEmpty()) {
            return new byte[0];
        }

        StringWriter writer = new StringWriter();

        List<Map<String, String>> flattenedRows = new ArrayList<>();
        List<String> headers = new ArrayList<>();

        for (JsonNode row : items) {

            Map<String, String> flattened = new LinkedHashMap<>();

            flattenNode(row, flattened);

            if (headers.isEmpty()) {
                headers.addAll(flattened.keySet());
            }

            flattenedRows.add(flattened);
        }

        writer.append(String.join(",", headers)).append("\n");

        for (Map<String, String> row : flattenedRows) {

            List<String> values = new ArrayList<>();

            for (String header : headers) {
                values.add(
                    escape(
                        row.getOrDefault(header, "")
                    )
                );
            }

            writer.append(String.join(",", values)).append("\n");
        }

        return writer.toString().getBytes(StandardCharsets.UTF_8);
    }

    public void appendRows(
            JsonNode items,
            BufferedWriter writer,
            boolean writeHeaders)
            throws IOException {

        if (items == null || !items.isArray() || items.isEmpty()) {
            return;
        }

        List<Map<String, String>> flattenedRows = new ArrayList<>();
        List<String> headers = new ArrayList<>();

        for (JsonNode row : items) {

            Map<String, String> flattened = new LinkedHashMap<>();

            flattenNode(row, flattened);

            if (headers.isEmpty()) {
                headers.addAll(flattened.keySet());
            }

            flattenedRows.add(flattened);
        }

        if (writeHeaders) {
            writer.write(String.join(",", headers));
            writer.newLine();
        }

        for (Map<String, String> row : flattenedRows) {

            List<String> values = new ArrayList<>();

            for (String header : headers) {
                values.add(
                    escape(
                        row.getOrDefault(header, "")
                    )
                );
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

    private void flattenNode(
        JsonNode node,
        Map<String, String> values
    ) {
        node.fields().forEachRemaining(entry -> {

            JsonNode value = entry.getValue();

            if (value.isObject()) {

                flattenNode(value, values);

            } else {

                values.put(
                    entry.getKey(),
                    value.isNull()
                        ? ""
                        : value.asText()
                );
            }
        });
    }

}