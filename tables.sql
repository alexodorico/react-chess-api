--RESULTS TABLE--
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    time_ended text NOT NULL,
    winner text NOT NULL REFERENCES users(username),
    loser text NOT NULL REFERENCES users(username)
);

CREATE UNIQUE INDEX results_pkey ON results(id int4_ops);

CREATE TABLE users (
    username text UNIQUE PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    wins integer NOT NULL DEFAULT 0,
    losses integer NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX users_username_key ON users(username text_ops);
CREATE UNIQUE INDEX users_email_key ON users(email text_ops);
CREATE UNIQUE INDEX users_pkey ON users(username text_ops);
