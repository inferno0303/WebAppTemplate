CREATE TABLE IF NOT EXISTS `user` (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT,
    role TEXT,
    gender TEXT,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    enable INTEGER,
    last_login_time INTEGER,
    create_time INTEGER
);
INSERT INTO 'user' (username, password, role, enable) VALUES ("admin", "admin", "admin", 1);
INSERT INTO 'user' (username, password, role, enable) VALUES ("a", "a", "user", 1);
COMMIT;