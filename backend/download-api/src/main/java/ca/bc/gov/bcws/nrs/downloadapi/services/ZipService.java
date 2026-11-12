package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.stereotype.Service;

@Service
public class ZipService {

    public byte[] createZip(Map<String, byte[]> files) throws IOException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zip = new ZipOutputStream(baos)) {

            for (var file : files.entrySet()) {

                zip.putNextEntry(new ZipEntry(file.getKey()));
                zip.write(file.getValue());
                zip.closeEntry();
            }
        }

        return baos.toByteArray();
    }

    public Path createZipFile(List<Path> files, Path zipFile) throws IOException {

        try (ZipOutputStream zip = new ZipOutputStream(
                Files.newOutputStream(zipFile))) {

            for (Path file : files) {

                zip.putNextEntry(
                    new ZipEntry(file.getFileName().toString()));

                Files.copy(file, zip);

                zip.closeEntry();
            }
        }

        return zipFile;
    }

}