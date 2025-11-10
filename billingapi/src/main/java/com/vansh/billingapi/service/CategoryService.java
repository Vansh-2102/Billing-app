package com.vansh.billingapi.service;

import com.vansh.billingapi.io.CategoryRequest;
import com.vansh.billingapi.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile image);
    List<CategoryResponse> read();
    void delete(String categoryId);
}