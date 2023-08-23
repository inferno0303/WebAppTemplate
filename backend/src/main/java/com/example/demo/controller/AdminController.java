package com.example.demo.controller;

import com.example.demo.component.Response;
import com.example.demo.entity.User;
import com.example.demo.mybatisMapper.UserMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AdminController {

    @Autowired
    UserMapper userMapper;

    @GetMapping("/admin_get_user_count")
    public String admin_get_user_count(HttpSession session) {
        // 如果不是管理员用户，则拒绝访问该接口
        Object role = session.getAttribute("role");
        if (!role.toString().equals("admin")) return Response.response403("您没有权限访问");

        Integer count = userMapper.admin_get_user_count();
        return Response.response(count, 200, "请求成功");
    }

    @GetMapping("/admin_get_user_list")
    public String admin_get_user_list(@RequestParam Integer limit, @RequestParam Integer offset, HttpSession session) {
        // 如果不是管理员用户，则拒绝访问该接口
        Object role = session.getAttribute("role");
        if (!role.toString().equals("admin")) return Response.response403("您没有权限访问");

        // 对limit参数进行校验，不能大于50
        if (limit > 50) return Response.response(null, 500, "limit参数过大");

        // 对offset参数进行校验，不能超过总记录数
        Integer count = userMapper.admin_get_user_count();
        if (offset > count) return Response.response(null, 500, "offset参数过大");

        List<User> allUser = userMapper.admin_get_user_list(limit, offset);
        return Response.response(allUser, 200, "请求成功");
    }

    @GetMapping("/admin_enable_disable_account")
    public String admin_enable_disable_account(@RequestParam String username, @RequestParam Integer enable, HttpSession session) {
        // 如果不是管理员用户，则拒绝访问该接口
        Object role = session.getAttribute("role");
        if (!role.toString().equals("admin")) return Response.response403("您没有权限访问");

        List<User> userByUsername = userMapper.get_user_by_username(username);
        if (userByUsername.size() != 1) return Response.response500("用户名未找到");

        // UPDATE SQL 的 WHERE 条件
        User _user = userByUsername.get(0);
        Integer i = userMapper.admin_enable_disable_account(_user.getId(), _user.getUsername(), enable);

        if (enable.equals(1)) return Response.response(i, 200, "已启用账户");
        if (enable.equals(0)) return Response.response(i, 200, "已禁用账户");
        else return Response.response(i, 200, "已操作账户的状态为：" + enable);
    }

    @GetMapping("/admin_delete_account")
    public String admin_delete_account(@RequestParam String username, HttpSession session) {
        // 如果不是管理员用户，则拒绝访问该接口
        Object role = session.getAttribute("role");
        if (!role.toString().equals("admin")) return Response.response403("您没有权限访问");

        List<User> userByUsername = userMapper.get_user_by_username(username);
        if (userByUsername.size() != 1) return Response.response500("用户名未找到");

        // UPDATE SQL 的 WHERE 条件
        User _user = userByUsername.get(0);
        Integer deletedRow = userMapper.admin_delete_account(_user.getId(), _user.getUsername());

        return Response.response(deletedRow, 200, "已删除" + deletedRow + "个用户");
    }

}
