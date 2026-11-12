package ca.bc.gov.bcws.nrs.downloadapi.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.junit.jupiter.api.Test;

class ZipServiceTest {

    private final ZipService zipService =
        new ZipService();

    @Test
    void createZip_SingleFile() throws Exception {

        Map<String, byte[]> files =
            new LinkedHashMap<>();

        files.put(
            "test.csv",
            "hello".getBytes(StandardCharsets.UTF_8));

        byte[] zipBytes =
            zipService.createZip(files);

        try (ZipInputStream zip =
                new ZipInputStream(
                    new ByteArrayInputStream(zipBytes))) {

            ZipEntry entry =
                zip.getNextEntry();

            assertEquals(
                "test.csv",
                entry.getName());
        }
    }

    @Test
    void createZip_MultipleFiles() throws Exception {

        Map<String, byte[]> files =
            new LinkedHashMap<>();

        files.put("file1.csv", "1".getBytes());
        files.put("file2.csv", "2".getBytes());

        byte[] zipBytes =
            zipService.createZip(files);

        int count = 0;

        try (ZipInputStream zip =
                new ZipInputStream(
                    new ByteArrayInputStream(zipBytes))) {

            while (zip.getNextEntry() != null) {
                count++;
            }
        }

        assertEquals(2, count);
    }

    @Test
    void createZipFile_CreatesPhysicalZip() throws Exception {

        Path tempDir =
            Files.createTempDirectory("zip-test");

        Path csv =
            tempDir.resolve("test.csv");

        Files.writeString(
            csv,
            "col1,col2\n1,2");

        Path zipFile =
            tempDir.resolve("output.zip");

        Path result =
            zipService.createZipFile(
                List.of(csv),
                zipFile);

        assertEquals(
            zipFile,
            result);

        assertTrue(
            Files.exists(zipFile));
    }
}