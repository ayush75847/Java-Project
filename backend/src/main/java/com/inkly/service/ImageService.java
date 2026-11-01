package com.inkly.service;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.inkly.exception.ApiException;

/** Everything that talks to Cloudinary lives here. */
@Service
public class ImageService {

    private static final Logger log = LoggerFactory.getLogger(ImageService.class);

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final String FOLDER = "inkly/posts";

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /** What Cloudinary gives back after an upload. */
    public record UploadedImage(String url, String publicId) {
    }

    public UploadedImage upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please choose an image file");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only JPG, PNG, WEBP or GIF images are allowed");
        }

        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", FOLDER, "resource_type", "image"));
            return new UploadedImage((String) result.get("secure_url"), (String) result.get("public_id"));
        } catch (IOException | RuntimeException e) {
            log.error("Cloudinary upload failed", e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Image upload failed, please try again");
        }
    }

    public void delete(String publicId) {
        if (publicId == null) {
            return;
        }
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException | RuntimeException e) {
            log.warn("Could not delete image {} from Cloudinary", publicId, e);
        }
    }
}