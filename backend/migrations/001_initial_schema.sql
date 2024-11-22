CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'registrar', 'admin', 'parent');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  role user_role NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  student_id VARCHAR(8) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (DATE_PART('year', AGE(CURRENT_DATE, birth_date))) STORED,
  blood_type blood_type NOT NULL,
  applying_grade INTEGER NOT NULL,
  home_address TEXT,
  photo_path VARCHAR(255),
  certificate_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  student_id INTEGER REFERENCES students(id),
  father_name VARCHAR(100) NOT NULL,
  mother_name VARCHAR(100) NOT NULL,
  phone_numbers TEXT[] NOT NULL,
  emails TEXT[] NOT NULL,
  jobs TEXT[] NOT NULL,
  workplace_address TEXT NOT NULL,
  father_photo_path VARCHAR(255),
  mother_photo_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  teacher_id VARCHAR(8) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  blood_type blood_type NOT NULL,
  home_address TEXT,
  profession VARCHAR(100) NOT NULL,
  photo_path VARCHAR(255),
  documents_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrars (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  registrar_id VARCHAR(8) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  blood_type blood_type NOT NULL,
  home_address TEXT,
  photo_path VARCHAR(255),
  documents_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (role, email, password) 
VALUES ('admin', 'administrator@school.com', '$2a$10$your_hashed_password_here');