package com.vansh.billingapi.controller;

import com.vansh.billingapi.io.CategoryRequest;
import com.vansh.billingapi.io.CategoryResponse;
import com.vansh.billingapi.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class Categorycontroller {

    private final CategoryService categoryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryResponse> addCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "bgColor", required = false) String bgColor,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        CategoryRequest request = new CategoryRequest(name, description, bgColor);
        CategoryResponse response = categoryService.add(request, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.read();
        return ResponseEntity.ok(categories);
    }


    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable String categoryId) {
        categoryService.delete(categoryId);
        return ResponseEntity.ok(Map.of(
                "message", "Category deleted successfully",
                "categoryId", categoryId
        ));
    }

}
