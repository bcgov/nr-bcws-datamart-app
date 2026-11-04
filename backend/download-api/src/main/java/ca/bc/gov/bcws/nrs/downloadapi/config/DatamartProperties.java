package ca.bc.gov.bcws.nrs.downloadapi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "datamart")
public class DatamartProperties {

    private String graphqlUrl;

    private int timeoutSeconds;

    public String getGraphqlUrl() {
        return graphqlUrl;
    }

    public void setGraphqlUrl(String graphqlUrl) {
        this.graphqlUrl = graphqlUrl;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(int timeoutSeconds) {
        this.timeoutSeconds = timeoutSeconds;
    }
}