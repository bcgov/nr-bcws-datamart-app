package ca.bc.gov.bcws.nrs.downloadapi.models;

import com.fasterxml.jackson.databind.JsonNode;

public class QueryResult {

    private String name;
    private JsonNode items;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JsonNode getItems() {
        return items;
    }

    public void setItems(JsonNode items) {
        this.items = items;
    }
}