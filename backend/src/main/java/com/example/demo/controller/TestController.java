package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class TestController {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/createTable")
    public String createTable() {
        String createTableSQL = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT)";
        jdbcTemplate.execute(createTableSQL);
        return "Table created successfully!";
    }

    @GetMapping("/insertSampleData")
    public String insertSampleData() {
        String insertDataSQL = "INSERT INTO users (username, email) VALUES (?, ?)";
        jdbcTemplate.update(insertDataSQL, "john_doe", "john@example.com");
        return "Sample data inserted successfully!";
    }

    @GetMapping("/selectSampleData")
    public List<Map<String, Object>> selectAllSampleData() {
        String selectDataSQL = "SELECT * FROM users LIMIT 1000";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(selectDataSQL);
        return maps;
    }
}
