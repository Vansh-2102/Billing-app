package com.vansh.billingapi.controller;

import com.vansh.billingapi.io.CategoryRequest;
import com.vansh.billingapi.io.CategoryResponse;
import com.vansh.billingapi.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class Categorycontroller {

    private final CategoryService categoryService;

    // ADMIN: add category
    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CategoryResponse> addCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "bgColor", required = false) String bgColor,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            CategoryRequest request = new CategoryRequest(name, description, bgColor);
            CategoryResponse response = categoryService.add(request, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Failed to add category: " + e.getMessage()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while adding category: " + e.getMessage()
            );
        }
    }

    // USER + ADMIN: get categories
    @GetMapping   // ✅ NO extra path
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.read());
    }

    // ADMIN: delete category
    @DeleteMapping("/admin/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable String categoryId) {
        categoryService.delete(categoryId);
        return ResponseEntity.ok(Map.of(
                "message", "Category deleted successfully",
                "categoryId", categoryId
        ));
    }
}
