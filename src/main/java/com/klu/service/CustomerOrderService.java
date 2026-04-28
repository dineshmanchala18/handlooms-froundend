package com.klu.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.CustomerOrder;
import com.klu.repo.CustomerOrderRepo;

@Service
public class CustomerOrderService {
    @Autowired
    private CustomerOrderRepo orderRepo;

    public List<CustomerOrder> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<CustomerOrder> getOrdersForUser(String userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public CustomerOrder createOrder(CustomerOrder order) {
        order.setId(null);
        order.setStatus("Confirmed");
        order.setPaymentStatus(order.getPaymentStatus() == null ? "SUCCESS" : order.getPaymentStatus());
        order.setPlacedAt(LocalDate.now());
        order.setEstimatedDelivery(LocalDate.now().plusDays(7));
        order.setCreatedAt(LocalDateTime.now());
        order.setTrackingId("TRK-HSK-" + System.currentTimeMillis());
        order.setItems(order.getItems());
        return orderRepo.save(order);
    }

    public CustomerOrder updateStatus(Long id, String status) {
        CustomerOrder order = orderRepo.findById(id).orElse(null);

        if (order == null) {
            return null;
        }

        order.setStatus(status);
        return orderRepo.save(order);
    }
}
