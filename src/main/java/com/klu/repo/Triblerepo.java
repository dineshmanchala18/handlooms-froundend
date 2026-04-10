package com.klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;


import com.klu.model.TribleInformation;

public interface Triblerepo extends JpaRepository<TribleInformation,Integer> {

}
