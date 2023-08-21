package com.example.demo.controller;

import com.example.demo.component.Response;
import com.example.demo.entity.User;
import com.example.demo.mybatisMapper.UserMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
public class TestController {

    @Autowired
    UserMapper userMapper;

    @RequestMapping("/hello")
    public String hello() {
        return "<p style=\"text-align: center;\">Hello World.</p>";
    }

    @GetMapping("/check_login_status")
    public String checkLoginStatus(HttpSession session) {
        Object username = session.getAttribute("username");
        Object role = session.getAttribute("role");
        Object last_login_time = session.getAttribute("last_login_time");
        if (username != null && role != null && last_login_time != null) {
            HashMap<String, Object> currentUser = new HashMap<>();
            currentUser.put("username", username);
            currentUser.put("role", role);
            currentUser.put("last_login_time", last_login_time);
            return Response.response(currentUser, 200, "当前用户已登录");
        } else {
            return Response.response(null, 403, "当前用户未登录");
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) {
        // 查询数据库
        List<User> userList = userMapper.loginCheck(user);
        if (userList.size() == 1) {
            // 获取当前系统时间
            Date date = new Date();

            // 更新最后登录成功的时间
            userMapper.updateLastLoginTime(userList.get(0), date);

            // 将登录信息写入session
            session.setAttribute("username", userList.get(0).getUsername());
            session.setAttribute("role", userList.get(0).getRole());
            session.setAttribute("last_login_time", date);

            HashMap<String, Object> result = new HashMap<>();
            result.put("username", userList.get(0).getUsername());
            result.put("role", userList.get(0).getRole());
            result.put("last_login_time", userList.get(0).getLast_login_time());
            return Response.response(result, 200, "登录成功");
        } else {
            return Response.response(null, 403, "用户名或密码错误，或当前账户未通过管理员审核");
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return Response.response(null, 200, "用户注销成功");
    }

    @PostMapping("/register")
    public String register(@RequestBody User user, HttpSession session) {
        List<User> userByUsername = userMapper.getUserByUsername(user.getUsername());
        if (!userByUsername.isEmpty()) {
            return Response.response(null, 500, "用户名重复");
        }
        user.setRole("user");
        user.setCreate_time(new Date().getTime());
        // 默认不启用该用户
        user.setEnable(0);
        Integer effectRows = userMapper.addNewUser(user);
        return Response.response(effectRows, 200, "账户注册成功");
    }

}
