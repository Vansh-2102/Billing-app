package com.vansh.billingapi.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface Cloudinaryimageservice {
    Map upload(MultipartFile file);
    Map delete(String publicIdOrUrl);
}
