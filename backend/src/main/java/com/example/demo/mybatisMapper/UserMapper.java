package com.example.demo.mybatisMapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.*;

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
    @Insert("INSERT INTO user (username, password, nickname, role, email, phone, enable, create_time) VALUES (#{username}, #{password}, #{nickname}, #{role}, #{email}, #{phone}, #{enable}, #{create_time})")
    public Integer add_new_user(User user);

    // 用户接口：用于更改用户信息
    @Update("UPDATE user SET password=#{password}, nickname=#{nickname}, email=#{email}, phone=#{phone}, gender=#{gender} WHERE id=#{id} AND username=#{username}")
    public Integer update_user_info(Integer id, String username, String password, String nickname, String email, String phone, String gender);

    // 用户接口：用于更新头像
    @Update("UPDATE user SET avatar=#{avatar} WHERE id=#{id} AND username=#{username}")
    public Integer updateAvatar(@Param("id") Integer id, @Param("username") String username, @Param("avatar") String avatar);

    // [即将废弃] 管理员接口：用于访问所有的用户列表
    @Select("SELECT * FROM user")
    public List<User> get_all_user();

    // 管理员接口：获取用户总数，用于分页
    @Select("SELECT COUNT(*) FROM user")
    public Integer admin_get_user_count();

    // 管理员接口：用于访问所有的用户列表
    @Select("SELECT * FROM user LIMIT #{limit} OFFSET #{offset}")
    public List<User> admin_get_user_list(Integer limit, Integer offset);

    // 管理员接口：用于启用或禁用账户
    @Update("UPDATE user SET enable=#{enable} WHERE id=#{id} AND username=#{username}")
    public Integer admin_enable_disable_account(@Param("id") Integer id, @Param("username") String username, @Param("enable") Integer enable);

    @Delete("DELETE FROM user WHERE id=#{id} AND username=#{username}")
    public Integer admin_delete_account(@Param("id") Integer id, @Param("username") String username);
}
