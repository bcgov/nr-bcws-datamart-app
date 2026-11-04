package ca.bc.gov.bcws.nrs.downloadapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class DownloadApiApplication {

    
    public static void main(String[] args) {
        SpringApplication.run(DownloadApiApplication.class, args);
    }
}