package com.example.demo.controller;

import com.example.demo.component.Response;
import com.example.demo.entity.User;
import com.example.demo.mybatisMapper.UserMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    @GetMapping("/get_user_info")
    public String get_user_info(HttpSession session) {
        Object username = session.getAttribute("username");
        List<User> userByUsername = userMapper.getUserByUsername(username.toString());
        if (userByUsername.size() != 1)
            return Response.response(null, 403, "当前用户未登录");
        User user = userByUsername.get(0);
        HashMap<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("password", user.getPassword());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("role", user.getRole());
        userInfo.put("gender", user.getGender());
        userInfo.put("email", user.getEmail());
        userInfo.put("phone", user.getPhone());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("enable", user.getEnable());
        userInfo.put("last_login_time", user.getLast_login_time());
        userInfo.put("create_time", user.getCreate_time());
        return Response.response(userInfo, 200, "查询成功");
    }
}
