CREATE TABLE IF NOT EXISTS users(
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,

    created_at timestamp with time zone DEFAULT transaction_timestamp(),
    updated_at timestamp with time zone DEFAULT transaction_timestamp()
);