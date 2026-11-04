package ca.bc.gov.bcws.nrs.downloadapi.clients;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;

import ca.bc.gov.bcws.nrs.downloadapi.config.DatamartProperties;

@Component
public class DatamartApiClient {

    private final RestClient restClient;
    private final DatamartProperties properties;

    private static final Logger logger = LoggerFactory.getLogger(DatamartApiClient.class);

    public DatamartApiClient(DatamartProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.create();
        logger.info("Datamart configuration loaded. graphqlUrl='{}', timeoutSeconds={}",
            properties.getGraphqlUrl(),
            properties.getTimeoutSeconds()
        );
    }

    public JsonNode executeQuery(String query) {

        return restClient.post()
                .uri(properties.getGraphqlUrl())
                .body(Map.of("query", query))
                .retrieve()
                .body(JsonNode.class);
    }
}