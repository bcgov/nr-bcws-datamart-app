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
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public static String generateTimestamp() {
        return LocalDateTime.now().format(TIMESTAMP_FORMAT);
    }

    public static String determineSuffix(
            boolean hasDaily,
            boolean hasHourly) {

        if (hasDaily && hasHourly)
            return "daily-hourly";

        if (hasDaily)
            return "daily";

        if (hasHourly)
            return "hourly";

        return "download";
    }

    public static String generateZipFileName(String suffix, String startDate, String endDate) {

        return String.format(
                "bcws-weather-datamart_%s_%s_%s_%s.zip",
                suffix,
                startDate,
                endDate,
                generateGuid());
    }

    public static String generateCsvFileName(
        String queryName,
        String startDate,
        String endDate) {

        return String.format(
            "bcws-weather-datamart_%s_%s_%s.csv",
            queryName,
            startDate,
            endDate);
    }
}