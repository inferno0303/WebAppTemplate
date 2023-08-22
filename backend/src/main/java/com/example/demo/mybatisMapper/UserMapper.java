package com.example.demo.mybatisMapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

@Mapper
public interface UserMapper {

    // 登录接口：用于登录检查密码
    @Select("SELECT * FROM user WHERE username=#{username} AND password=#{password}")
    public List<User> user_login(User user);

    // 登录接口：用于更新最后登录的时间
    @Select("UPDATE user SET last_login_time=#{date} WHERE id=#{user.id} AND username=#{user.username} AND password=#{user.password}")
    public void update_last_login_time(User user, Date date);

    // 注册接口：用于查重
    // 用户接口：用于获取自己的信息
    @Select("SELECT * FROM user WHERE username=#{username}")
    public List<User> get_user_by_username(String username);

    // 注册接口：用于新增用户
    @Insert("INSERT INTO user (username, password, role, create_time, enable) VALUES (#{username}, #{password}, #{role}, #{create_time}, #{enable})")
    public Integer add_new_user(User user);

    // [即将废弃] 管理员接口：用于访问所有的用户列表
    @Select("SELECT * FROM user")
    public List<User> get_all_user();

    // 管理员接口：获取用户总数，用于分页
    @Select("SELECT COUNT(*) FROM user")
    public Integer admin_get_user_count();

    // 管理员接口：用于访问所有的用户列表
    @Select("SELECT * FROM user LIMIT #{limit} OFFSET #{offset}")
    public List<User> admin_get_user_list(Integer limit, Integer offset);
}
