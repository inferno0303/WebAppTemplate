# 介绍

该项目是一个前后端分离项目（WebApp）的工程模板，包含登录、注册、账户管理的基本代码，基于 SpringBoot 和 Vue.js 框架，自用😄

```
version: v20230824
author: @inferno0303
```

## 如何使用

### 前端

`frontend`文件夹就是前端的静态目录

### 后端

`backend`文件夹就是SpringBoot工程目录


### 数据库
`sqlite.db`是sqlite数据库文件，运行时位于`backend/`下

## 更新历史

### 20230814
- initialize repository

### 20230816
- feat: 添加了Vue、axios、element-plus、HarmonyOS_Sans_SC字体
- feat: 重写了login.html页面的全部逻辑，移除了注册账户对话框

### 20230818
- fix: 修改了login页面的逻辑
- feat: 创建了后端模板

### 20230820
- feat: 添加了sqlite到后端工程

### 20230821
- feat: 新增了404和500页面，添加了默认的sqlite表结构
- refactor: 重构了登录接口

### 20230822
- feat: 实现了注册界面，登录跳转，公共headers样式
- refactor: 重构了登录界面样式

### 20230823
- feat: 实现了admin用户管理功能
- feat: 实现了user用户信息更改、更换头像功能
- fix: 解决了后端由于拦截器引起的OPTIONS请求被跨域阻止问题

### 20230824
- refactor: 重构了前端部分代码，将样式转移至 common_style
- feat: 针对 HTTP-403 响应自动跳转到登录页
- feat: 注册功能现在可以填写更多信息了，包括昵称、邮箱、电话
- feat: user表的username字段增加唯一索引，防止username字段有重复值
- feat: 后端在启动时，确保user表中只有一个admin用户，确保可以进入管理页
