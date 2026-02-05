package com.vansh.billingapi.service.imp;

import com.vansh.billingapi.entity.CategoryEntity;
import com.vansh.billingapi.entity.ItemEntity;
import com.vansh.billingapi.io.ItemRequest;
import com.vansh.billingapi.io.ItemResponse;
import com.vansh.billingapi.repository.CategoryRepository;
import com.vansh.billingapi.repository.ItemRepository;
import com.vansh.billingapi.service.Cloudinaryimageservice;
import com.vansh.billingapi.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final Cloudinaryimageservice fileUploadService;
    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {

        // ✅ Upload image
        Map uploadResult = fileUploadService.upload(file);

        // ✅ Extract ONLY required fields
        String imgUrl = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();

        // Create item
        ItemEntity newItem = convertToEntity(request);

        CategoryEntity existingCategory = categoryRepository
                .findByCategoryId(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found " + request.getCategoryId())
                );

        newItem.setCategory(existingCategory);
        newItem.setImgUrl(imgUrl);
        newItem.setImagePublicId(publicId); // ✅ IMPORTANT

        newItem = itemRepository.save(newItem);

        return convertToResponse(newItem);
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {

        ItemEntity existingItem = itemRepository
                .findByItemId(itemId)
                .orElseThrow(() ->
                        new RuntimeException("Item not found " + itemId)
                );

        // ✅ Delete from Cloudinary using public_id
        fileUploadService.delete(existingItem.getImagePublicId());

        itemRepository.delete(existingItem);
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    private ItemResponse convertToResponse(ItemEntity item) {
        return ItemResponse.builder()
                .itemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imgUrl(item.getImgUrl())
                .categoryId(item.getCategory().getCategoryId())
                .categoryName(item.getCategory().getName())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
