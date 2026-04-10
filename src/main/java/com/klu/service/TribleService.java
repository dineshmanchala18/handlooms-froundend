package com.klu.service;

import java.util.Optional;   // ✅ IMPORTANT IMPORT

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.TribleInformation;
import com.klu.repo.Triblerepo;

@Service
public class TribleService {

    @Autowired
    private Triblerepo ti;

    // Save
    public String saveTribleinformation(TribleInformation t) {
        ti.save(t);
        return "Trible Information Saved Successfully";
    }

    // Delete using ID
    public String deleteTribleinformation(int trible_id) {
        ti.deleteById(trible_id);
        return "Trible Information Deleted Successfully";
    }

    // Update
    public String updateTribleinformation(int trible_id, TribleInformation updatedTrible) {

        Optional<TribleInformation> existing = ti.findById(trible_id);

        if (existing.isPresent()) {

            TribleInformation t = existing.get();

            t.setTrible_name(updatedTrible.getTrible_name());
            t.setState(updatedTrible.getState());
            t.setDistrict(updatedTrible.getDistrict());
            t.setTraditional_skill(updatedTrible.getTraditional_skill());
            t.setPhone_number(updatedTrible.getPhone_number());

            ti.save(t);

            return "Trible Information Updated Successfully";
        } else {
            return "Trible ID Not Found";
        }
    }
}