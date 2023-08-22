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
public class LoginController {

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
        List<User> userList = userMapper.user_login(user);
        if (userList.size() == 1) {
            User _user = userList.get(0);
            // 用户已启用
            if (_user.getEnable() == 1) {
                Date date = new Date();
                userMapper.update_last_login_time(_user, date);
                // 将登录信息写入session
                session.setAttribute("username", _user.getUsername());
                session.setAttribute("role", _user.getRole());
                session.setAttribute("last_login_time", date);
                HashMap<String, Object> result = new HashMap<>();
                result.put("username", _user.getUsername());
                result.put("role", _user.getRole());
                result.put("last_login_time", _user.getLast_login_time());
                return Response.response(result, 200, "用户登录成功");
            }
            // 用户未启用
            else if (_user.getEnable() == 0) {
                return Response.response(null, 403, "用户名" + user.getUsername() + "未通过管理员审核");
            }
            // 用户被封禁
            else {
                return Response.response(null, 403, "用户名" + user.getUsername() + "被禁止使用");
            }
        }
        return Response.response(null, 403, "用户名或密码错误");
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return Response.response(null, 200, "用户注销成功");
    }

    @PostMapping("/register")
    public String register(@RequestBody User user, HttpSession session) {
        List<User> userByUsername = userMapper.get_user_by_username(user.getUsername());
        if (!userByUsername.isEmpty()) {
            return Response.response(null, 500, "用户名已被使用");
        }
        user.setRole("user");
        user.setCreate_time(new Date().getTime());
        // 默认不启用该用户
        user.setEnable(0);
        Integer effectRows = userMapper.add_new_user(user);
        return Response.response(effectRows, 200, "账户注册成功");
    }

}
