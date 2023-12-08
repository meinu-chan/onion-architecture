CREATE TABLE sessions (
    refresh_token VARCHAR NOT NULL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT transaction_timestamp(),
    updated_at timestamp with time zone DEFAULT transaction_timestamp(),
    UNIQUE (refresh_token, user_id)
);