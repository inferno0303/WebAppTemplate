package com.example.demo.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.demo.component.Response;
import com.example.demo.entity.User;
import com.example.demo.mybatisMapper.UserMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    // 用户获取自己的信息
    @GetMapping("/get_user_info")
    public String get_user_info(HttpSession session) {
        // 从session里取出username，以username为依据查询用户记录
        Object username = session.getAttribute("username");
        List<User> userByUsername = userMapper.get_user_by_username(username.toString());
        if (userByUsername.size() != 1) return Response.response403("当前用户未登录");

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

    @PostMapping("/update_user_info")
    public String update_user_info(@RequestBody User user, HttpSession session) {
        // 从session里取出username，以username为依据查询要更新的用户记录，不能信任用户传回来的用户名字段
        Object username = session.getAttribute("username");
        List<User> userByUsername = userMapper.get_user_by_username(username.toString());
        if (userByUsername.size() != 1) return Response.response403("当前用户未登录");

        // UPDATE SQL 中 WHERE 的条件参数
        User _user = userByUsername.get(0);
        int _id = _user.getId();
        String _username = _user.getUsername();

        // 更新数据库
        Integer updateRow = userMapper.update_user_info(_id, _username, user.getPassword(), user.getNickname(), user.getEmail(), user.getPhone(), user.getGender());
        return Response.response(updateRow, 200, "更新成功");
    }

    @PostMapping("/update_avatar")
    public String update_avatar(@RequestBody String json, HttpSession httpSession) {
        // 通过 session 拿到用户Id
        Object username = httpSession.getAttribute("username");
        List<User> userByUsername = userMapper.get_user_by_username(username.toString());
        if (userByUsername.size() != 1) return Response.response403("当前用户未登录");

        // UPDATE SQL 中 WHERE 的条件参数
        User _user = userByUsername.get(0);
        int _id = _user.getId();
        String _username = _user.getUsername();

        // 解析 POST body
        JSONObject obj = JSON.parseObject(json);
        String base64Avatar = (String) obj.get("avatar"); // 这里的base64Avatar是类似于："data:image/jpeg;base64,xxx"开头的字符串
        // 检查原始的内容大小是否大于200KB，其中1.35是base64字节与原始字节的长度比值
        if (base64Avatar.length() > 200 * 1024 * 1.35) {
            return Response.response(null, 500, "文件太大，请选择小于200KB的文件");
        }

        // 更新数据库
        Integer updateRow = userMapper.updateAvatar(_id, _username, base64Avatar);
        return Response.response(updateRow, 200, "更新头像成功");
    }
}
