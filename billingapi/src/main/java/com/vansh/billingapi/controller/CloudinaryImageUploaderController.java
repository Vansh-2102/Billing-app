package com.vansh.billingapi.controller;

import com.vansh.billingapi.service.Cloudinaryimageservice;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CloudinaryImageUploaderController {

    private final Cloudinaryimageservice cloudinaryimageservice;

    public CloudinaryImageUploaderController(Cloudinaryimageservice cloudinaryimageservice) {
        this.cloudinaryimageservice = cloudinaryimageservice;
    }

    @PostMapping(
            path = "/cloudinary/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map> uploadImage(@RequestParam("image") MultipartFile file) {
        Map data = this.cloudinaryimageservice.upload(file);
        return ResponseEntity.ok(data);
    }
}
