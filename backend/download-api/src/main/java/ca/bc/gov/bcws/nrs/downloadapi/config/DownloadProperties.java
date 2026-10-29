package ca.bc.gov.bcws.nrs.downloadapi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "download")
public class DownloadProperties {

    private int syncThreshold;

    public int getSyncThreshold() {
        return syncThreshold;
    }

    public void setSyncThreshold(int syncThreshold) {
        this.syncThreshold = syncThreshold;
    }
}