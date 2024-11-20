-- Drop existing role, database, and tables if they exist
DROP ROLE IF EXISTS schoolhub_user;
DROP DATABASE IF EXISTS schoolhub;

-- Recreate the user and database
CREATE USER schoolhub_user WITH PASSWORD 'schoolhub_password';
ALTER USER schoolhub_user CREATEDB;

CREATE DATABASE schoolhub OWNER schoolhub_user;

\c schoolhub;

-- Drop tables if they exist
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Teachers;
DROP TABLE IF EXISTS Registrars;
DROP TABLE IF EXISTS Admins;

-- Create Parents Table for parent credentials
CREATE TABLE Parents (
    parent_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    job VARCHAR(255),
    workplace_address VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    photo BYTEA,
    nationality VARCHAR(255) DEFAULT 'Ethiopian',  -- Default to Ethiopian if not provided
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically sets the timestamp when a parent record is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically sets the timestamp when a parent record is updated
);

-- Create Students Table with a foreign key to Parents
CREATE TABLE Students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    student_id_number VARCHAR(20) UNIQUE NOT NULL,
    grandfather_name VARCHAR(255),
    photo BYTEA,
    previous_grade_certificate BYTEA,
    birthdate DATE NOT NULL,
    blood_type VARCHAR(3),
    gender VARCHAR(10),
    applying_grade VARCHAR(10),
    home_address VARCHAR(255),
    address JSONB,  -- Store address as JSONB
    password VARCHAR(255) NOT NULL,
    parent_id INT REFERENCES Parents(parent_id), -- Foreign key to Parents table
    nationality VARCHAR(255),
    age INT, -- removed generated expression
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically sets the timestamp when a parent record is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Automatically sets the timestamp when a parent record is updated
);

-- Create Teachers Table
CREATE TABLE Teachers (
    teacher_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    photo BYTEA,
    phone_number VARCHAR(15),
    necessary_documents BYTEA,
    password VARCHAR(255) NOT NULL,
    blood_type VARCHAR(3),
    home_address VARCHAR(255),
    profession VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(100),
    teacher_id_number VARCHAR(8) UNIQUE,
    teacher_id_pdf_path VARCHAR(255)
);

-- Create Registrars Table
CREATE TABLE Registrars (
    registrar_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    photo BYTEA,
    phone_number VARCHAR(15),
    necessary_documents BYTEA,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    home_address VARCHAR(255),
    blood_type VARCHAR(3),
    registrar_id_number VARCHAR(8) UNIQUE,
    registrar_pdf_path VARCHAR(255)
);

-- Create Admins Table
CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert the Admin Record (check if already exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM Admins WHERE username = 'Administrator') THEN 
        INSERT INTO Admins (username, password) 
        VALUES ('Administrator', '$2a$12$DjW5urslcWawHB4cnzGjH.xMMLHbiPrjKHRO4V3rMKa50Sp0WsNji'); 
    END IF; 
END $$;

-- Trigger Function to Update Age
CREATE OR REPLACE FUNCTION update_age() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.age := EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM NEW.birthdate); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_age_before_insert_or_update
BEFORE INSERT OR UPDATE ON Students
FOR EACH ROW
EXECUTE FUNCTION update_age();
