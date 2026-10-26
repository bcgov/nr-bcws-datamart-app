package ca.bc.gov.bcws.nrs.downloadapi.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public final class Utils {

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private Utils() {
    }

    public static String generateGuid() {
        return UUID.randomUUID().toString();
    }

    public static String generateTimestamp() {
        return LocalDateTime.now().format(TIMESTAMP_FORMAT);
    }
}