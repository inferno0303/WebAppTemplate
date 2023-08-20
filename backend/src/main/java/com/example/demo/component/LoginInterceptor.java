package com.example.demo.component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginInterceptor implements HandlerInterceptor {

    // 实现拦截器方法，用于登录状态检查
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        HttpSession session = request.getSession();
//        Object username = session.getAttribute("username");
//
//        // 如果session中存在登录状态，则不做处理，放行请求
//        if (username != null) {
//            return true;
//        }
//
//        // 如果session中不存在登录状态，则返回403状态码，并拦截请求
//        else {
//
//            // 设置状态码为403
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//
//            // 设置响应内容
//            String errorMessage = "您还未登录，没有权限访问该接口。";
//            response.setContentType("text/plain");
//            response.setCharacterEncoding("UTF-8");
//            response.getWriter().write(errorMessage);
//            return false;
//        }
//    }
}
