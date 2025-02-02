-- Active: 1684867259082@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME())
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT (0),
        dislikes INTEGER NOT NULL DEFAULT (0),
        created_at TEXT NOT NULL DEFAULT (DATETIME()),
        updated_at TEXT NOT NULL DEFAULT (DATETIME()),
        Foreign Key (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        likes INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        Foreign Key (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO users VALUES ('U001', 'dionisios', 'dionisios@email.com', 'dionisios', 'ADMIN', '2023-06-02T13:11:15.619Z');