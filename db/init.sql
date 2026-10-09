CREATE TABLE IF NOT EXISTS verified_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    is_valid BOOLEAN NOT NULL,
    mx_records TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO verified_emails (email, is_valid, mx_records) 
VALUES ('test@google.com', true, '[{"exchange":"smtp.google.com","priority":10}]');
