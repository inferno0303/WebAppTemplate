package com.example.demo.component;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;


// 监听事件，执行创建表结构SQL，仅当数据表不存在的时候执行
@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        try {
            ClassPathResource resource = new ClassPathResource("init.sql");
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            String sql = new String(bytes, StandardCharsets.UTF_8);

            // 执行初始化SQL语句，禁用事务管理
            jdbcTemplate.execute(sql);
//          jdbcTemplate.execute("INSERT INTO `user` (username, password, role, create_time, enable) VALUES (\"admin\", \"admin\", \"admin\", 0, 1);");
//          jdbcTemplate.execute("INSERT INTO `user` (username, password, role, create_time, enable) VALUES (\"a\", \"a\", \"user\", 0, 1);");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
