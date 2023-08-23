package com.example.demo.component;

import com.alibaba.fastjson2.JSON;

import java.util.HashMap;

public class Response {
    public static String response(Object data, int code, String message) {
        HashMap<String, Object> map = new HashMap<>(3);
        map.put("code", code);
        map.put("message", message);
        map.put("data", data);
        return JSON.toJSONString(map);
    }

    public static String response403(String message) {
        HashMap<String, Object> map = new HashMap<>(3);
        map.put("code", 403);
        map.put("message", message);
        map.put("data", null);
        return JSON.toJSONString(map);
    }

    public static String response500(String message) {
        HashMap<String, Object> map = new HashMap<>(3);
        map.put("code", 500);
        map.put("message", message);
        map.put("data", null);
        return JSON.toJSONString(map);
    }
}
