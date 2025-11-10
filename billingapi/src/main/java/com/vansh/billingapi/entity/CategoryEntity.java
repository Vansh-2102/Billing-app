package com.vansh.billingapi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name="tbl_category")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String categoryId;

    private String name;

    @Column(length = 2000)
    private String description;

    private String bgColor;

    // New: store Cloudinary image URL and public id
    @Column(length = 2000)
    private String imgUrl;

    private String imagePublicId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
