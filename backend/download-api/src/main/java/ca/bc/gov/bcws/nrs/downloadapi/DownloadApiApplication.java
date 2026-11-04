package ca.bc.gov.bcws.nrs.downloadapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class DownloadApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DownloadApiApplication.class, args);
    }
}