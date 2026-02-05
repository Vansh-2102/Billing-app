package com.vansh.billingapi.service.imp;

import com.vansh.billingapi.entity.CategoryEntity;
import com.vansh.billingapi.io.CategoryRequest;
import com.vansh.billingapi.io.CategoryResponse;
import com.vansh.billingapi.repository.CategoryRepository;
import com.vansh.billingapi.repository.ItemRepository;
import com.vansh.billingapi.service.CategoryService;
import com.vansh.billingapi.service.Cloudinaryimageservice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final Cloudinaryimageservice cloudinaryimageservice;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public CategoryResponse add(CategoryRequest request, MultipartFile image) {
        String publicId = null;
        String secureUrl = null;
        try {
            if (image != null && !image.isEmpty()) {
                Map uploadResult = cloudinaryimageservice.upload(image);
                secureUrl = (String) uploadResult.get("secure_url");
                publicId = (String) uploadResult.get("public_id");
            }

            CategoryEntity newCategory = CategoryEntity.builder()
                    .categoryId(UUID.randomUUID().toString())
                    .name(request.getName())
                    .description(request.getDescription())
                    .bgColor(request.getBgColor())
                    .imgUrl(secureUrl)
                    .imagePublicId(publicId)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            CategoryEntity saved = categoryRepository.save(newCategory);
            return convertToResponse(saved);

        } catch (RuntimeException  ex) {
            // rollback uploaded image if DB save failed
            if (publicId != null) {
                try {
                    cloudinaryimageservice.delete(publicId);
                } catch (Exception ignored) {
                    // log if you have a logger; don't mask original exception
                    System.err.println("Failed to cleanup uploaded image: " + ignored.getMessage());
                }
            }
            throw ex;
        }
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(String categoryId) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        String publicId = existingCategory.getImagePublicId();
        if (publicId != null && !publicId.isBlank()) {
            Map result = cloudinaryimageservice.delete(publicId);
            // optional: validate result.get("result") == "ok"
        }

        categoryRepository.delete(existingCategory);
    }

    private CategoryResponse convertToResponse(CategoryEntity newCategory) {
        Integer itemCount = itemRepository.countByCategory_Id(newCategory.getId());
        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .description(newCategory.getDescription())
                .bgColor(newCategory.getBgColor())
                .imgUrl(newCategory.getImgUrl())
                .createdAt(newCategory.getCreatedAt())
                .updateAt(newCategory.getUpdatedAt())
                .items(itemCount)
                .build();
    }
}