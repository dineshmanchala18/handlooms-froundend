package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klu.model.TribleInformation;
import com.klu.service.TribleService;

@RestController
@RequestMapping("/trible")
public class tribleController {

    @Autowired
    private TribleService pr;

    // SAVE
    @PostMapping("/savetrible")
    public String savetribleinformation(@RequestBody TribleInformation t) {
        return pr.saveTribleinformation(t);
    }

    // DELETE
    @DeleteMapping("/deletetrible/{id}")
    public String deletetribleinformation(@PathVariable("id") int trible_id) {
        return pr.deleteTribleinformation(trible_id);
    }

    // UPDATE
    @PutMapping("/updatetrible/{id}")
    public String updatetribleinformation(@PathVariable("id") int trible_id,
                                          @RequestBody TribleInformation t) {
        return pr.updateTribleinformation(trible_id, t);
    }
}