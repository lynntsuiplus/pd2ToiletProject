package com.example.toilet;

import com.example.toilet.Location;
import com.example.toilet.JdbcOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin() // 允许来自前端应用的跨域请求
public class LocationController {

    private final JdbcOperation jdbcOperation;

    @Autowired
    public LocationController(JdbcOperation jdbcOperation) {
        this.jdbcOperation = jdbcOperation;
    }

    @GetMapping("/getToiletLocations")
    public List<Location> getToiletLocations() {
        List<Location> toilets = JdbcOperation.getAllLocations();
        return toilets != null ? toilets : Collections.emptyList();
    }

    @PostMapping("/addToiletLocation")
    public void addToiletLocation(@RequestBody Location location) {
        jdbcOperation.addToiletLocation(location);
    }

    @GetMapping("/checkToiletLocation")
    public boolean checkToiletLocation(@RequestParam double latitude, @RequestParam double longitude) {
        return jdbcOperation.checkLocationExists(latitude, longitude);
    }
}
