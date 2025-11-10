package com.vansh.billingapi.service;

import com.vansh.billingapi.io.CategoryRequest;
import com.vansh.billingapi.io.CategoryResponse;

import java.util.List;

public interface CategoryService {

  CategoryResponse add(CategoryRequest request);

  List<CategoryResponse> read();

  void delete(String categoryId);
}
