package com.klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.User;

public interface Userrepo extends JpaRepository<User, Long> {
	User findByEmailAndRole(String email,String role);
	User findByPhoneAndRole(String phone,String role);
	boolean existsByEmailAndRole(String email,String role);

}
