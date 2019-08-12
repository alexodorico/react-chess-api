--RESULTS TABLE--
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    winner integer NOT NULL REFERENCES users(id),
    loser integer NOT NULL REFERENCES users(id),
    time_ended text NOT NULL
);

CREATE UNIQUE INDEX results_pkey ON results(id int4_ops);

--USER TABLE--
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);