package com.vansh.billingapi.service;

import com.vansh.billingapi.io.ItemRequest;
import com.vansh.billingapi.io.ItemResponse;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface ItemService {

    ItemResponse add(ItemRequest request, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
