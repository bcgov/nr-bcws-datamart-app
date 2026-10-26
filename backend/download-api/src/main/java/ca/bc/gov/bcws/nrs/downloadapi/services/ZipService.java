package ca.bc.gov.bcws.nrs.downloadapi.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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
}