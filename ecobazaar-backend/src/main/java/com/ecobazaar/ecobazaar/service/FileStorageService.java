package com.ecobazaar.ecobazaar.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");

    public String save(MultipartFile file) {
        try {
            // Ensure the directory exists
            if (Files.notExists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "-" +
                    (originalName != null ? originalName : "file");

            Path target = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path (you can change this to URL later)
            return target.toString();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
