package ca.bc.gov.bcws.nrs.downloadapi.models;

import com.fasterxml.jackson.databind.JsonNode;

public class QueryResult {

    private String name;
    private JsonNode response;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JsonNode getResponse() {
        return response;
    }

    public void setResponse(JsonNode response) {
        this.response = response;
    }
}