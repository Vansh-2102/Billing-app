package com.vansh.billingapi.controller;

import com.vansh.billingapi.service.Cloudinaryimageservice;
import org.springframework.http.HttpStatus;
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


    @DeleteMapping("/cloudinary/delete/{publicId}")
    public ResponseEntity<?> deleteImage(@PathVariable String publicId) {
        Map result = cloudinaryimageservice.delete(publicId);
        String status = (String) result.get("result");
        if ("ok".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(Map.of("message", "deleted"));
        } else if ("not found".equalsIgnoreCase(status)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "not found"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "delete failed", "detail", result));
        }
    }


}
