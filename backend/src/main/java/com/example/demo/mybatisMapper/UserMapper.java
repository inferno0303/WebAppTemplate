package com.example.demo.mybatisMapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user")
    public List<String> getAllUser();

    // 登录检查
    @Select("SELECT * FROM user WHERE username=#{username} AND password=#{password} AND enable=1")
    public List<User> loginCheck(User user);

    // 更新最后登录成功的时间
    @Select("UPDATE user SET last_login_time=#{date} WHERE id=#{user.id} AND username=#{user.username} AND password=#{user.password}")
    public void updateLastLoginTime(User user, Date date);

    @Select("SELECT * FROM user WHERE username=#{username}")
    public List<User> getUserByUsername(String username);

    @Insert("INSERT INTO user (username, password, role, create_time, enable) VALUES (#{username}, #{password}, #{role}, #{create_time}, #{enable})")
    public Integer addNewUser(User user);
}
