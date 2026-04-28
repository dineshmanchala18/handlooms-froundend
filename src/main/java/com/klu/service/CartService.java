package com.klu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.model.CartItem;
import com.klu.repo.CartItemRepo;

@Service
public class CartService {
    @Autowired
    private CartItemRepo cartItemRepo;

    public List<CartItem> getCart(String userId) {
        return cartItemRepo.findByUserId(userId);
    }

    @Transactional
    public List<CartItem> replaceCart(String userId, List<CartItem> items) {
        cartItemRepo.deleteByUserId(userId);

        if (items != null) {
            items.forEach((item) -> {
                item.setId(null);
                item.setUserId(userId);
            });
            cartItemRepo.saveAll(items);
        }

        return cartItemRepo.findByUserId(userId);
    }

    @Transactional
    public void clearCart(String userId) {
        cartItemRepo.deleteByUserId(userId);
    }
}
