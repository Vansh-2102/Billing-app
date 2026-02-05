package com.vansh.billingapi.service;

import com.vansh.billingapi.io.UserRequest;
import com.vansh.billingapi.io.UserResponse;

import java.util.List;

public interface UserService {

   UserResponse createUser(UserRequest request);

  String getUserRole(String email);

  List<UserResponse> readUsers();

  void deleteUser(String id);
}
