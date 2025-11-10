package com.vansh.billingapi.service;


import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface Cloudinaryimageservice {

    public Map upload(MultipartFile file);
}
