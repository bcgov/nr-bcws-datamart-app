package ca.bc.gov.bcws.nrs.downloadapi.models;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QueryResult {

    private String name;
    private JsonNode items;

}