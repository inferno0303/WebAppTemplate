package com.example.demo.component;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;


// 监听事件，执行创建表结构SQL，仅当数据表不存在的时候执行
@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 确保数据库表结构正确，且始终存在一个管理员账户
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        try {
            // 如果表结构不存在，则导入表结构
            ClassPathResource resource = new ClassPathResource("init.sql");
            byte[] bytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            String sql = new String(bytes, StandardCharsets.UTF_8);
            jdbcTemplate.execute(sql);

            // 以下代码是确保数据库中总有一个 admin 用户，以防止无法进入管理页
            List<Map<String, Object>> users = jdbcTemplate.queryForList("SELECT * FROM user WHERE username='admin'");
            // 如果 admin 用户不唯一，则删除所有的admin用户，并且创建一个 admin 用户
            if (users.size() > 1) {
                jdbcTemplate.execute("DELETE FROM user WHERE username='admin'");
                jdbcTemplate.execute("INSERT INTO user (username, password, role, enable) VALUES ('admin', 'admin', 'admin', 1)");
            }
            // 如果没有 admin 用户，则创建一个 admin 用户
            if (users.isEmpty()) {
                jdbcTemplate.execute("INSERT INTO user (username, password, role, enable) VALUES ('admin', 'admin', 'admin', 1)");
            }
            // 如果只有一个 admin 用户
            if (users.size() == 1) {
                jdbcTemplate.execute("UPDATE user SET role='admin', enable=1 WHERE username='admin'");
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
