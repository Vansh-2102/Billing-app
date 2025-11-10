package com.vansh.billingapi.service.imp;

import com.cloudinary.Cloudinary;
import com.vansh.billingapi.service.Cloudinaryimageservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageServiceImpl implements Cloudinaryimageservice {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public Map upload(MultipartFile file) {
        try {
            return this.cloudinary.uploader().upload(file.getBytes(), Map.of());
        } catch (IOException e) {
            throw new RuntimeException("Image uploading fail!", e);
        }
    }

    @Override
    public Map delete(String publicId) {
        try {
            Map options = Map.of("resource_type", "image", "invalidate", true);
            Map result = cloudinary.uploader().destroy(publicId, options);
            System.out.println("delete publicId=" + publicId + " -> " + result);
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Image deletion failed", e);
        }
    }
}
