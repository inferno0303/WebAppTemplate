--users表结构，用于存放账户信息
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT,
    gender TEXT,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    enable INTEGER,
    last_login_time INTEGER,
    create_time INTEGER
)