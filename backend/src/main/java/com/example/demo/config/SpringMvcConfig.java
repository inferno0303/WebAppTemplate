package com.example.demo.config;

import com.example.demo.component.LoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {

    // 给SpringMvc添加拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 添加自定义拦截器
        registry.addInterceptor(new LoginInterceptor())
                // 对所有请求进行拦截
                .addPathPatterns("/**")
                // 排除未登录时可以访问的页面，以及所有静态资源
                .excludePathPatterns(
                        "/hello",
                        "/check_login_status",
                        "/login",
                        "/register",
                        // 排除所有静态资源
                        "/static/**",
                        "/**.html",
                        "/**.css",
                        "/**.js",
                        "/favicon.*"
                );
    }

    // 放通访问后，添加允许接受跨域请求的 Headers
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
