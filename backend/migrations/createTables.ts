// backend/migrations/createTables.ts

import { db } from '../config/dbConfig';

const createTables = async () => {
    try {
        // Create roles table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                role_name VARCHAR(100) UNIQUE NOT NULL
            )
        `);
        console.log('✔️ Roles table created successfully');

        // Create users table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE NOT NULL
            )
        `);
        console.log('✔️ Users table created successfully');

        // Create finance table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS finance (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                registrar_id VARCHAR(8) UNIQUE NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                primary_contact_number VARCHAR(20) NOT NULL,
                email_address VARCHAR(255) UNIQUE NOT NULL,
                blood_group VARCHAR(5) NOT NULL,
                image VARCHAR(255),
                date_of_joining DATE NOT NULL,
                gender VARCHAR(20) NOT NULL,
                fathers_name VARCHAR(100) NOT NULL,
                mothers_name VARCHAR(100) NOT NULL,
                date_of_birth DATE NOT NULL,
                marital_status VARCHAR(50) NOT NULL,
                languages_known TEXT,
                qualification VARCHAR(255) NOT NULL,
                work_experience INTEGER NOT NULL,
                previous_work VARCHAR(255),
                previous_work_address VARCHAR(255),
                previous_work_phone_number VARCHAR(20),
                address VARCHAR(255) NOT NULL,
                permanent_address VARCHAR(255) NOT NULL,
                pan_number VARCHAR(20) NOT NULL,
                epf_number VARCHAR(20) NOT NULL,
                basic_salary INTEGER NOT NULL,
                contract_type VARCHAR(50) NOT NULL,
                work_shift VARCHAR(50) NOT NULL,
                work_location VARCHAR(255) NOT NULL,
                date_of_leaving DATE,
                medical_leaves INTEGER NOT NULL,
                casual_leaves INTEGER NOT NULL,
                maternity_leaves INTEGER NOT NULL,
                sick_leaves INTEGER NOT NULL,
                account_name VARCHAR(100) NOT NULL,
                account_number VARCHAR(20) NOT NULL,
                bank_name VARCHAR(100) NOT NULL,
                ifsc_code VARCHAR(20) NOT NULL,
                facebook VARCHAR(255),
                instagram VARCHAR(255),
                linkedin VARCHAR(255),
                youtube VARCHAR(255),
                twitter_url VARCHAR(255),
                resume VARCHAR(255),
                joining_letter VARCHAR(255),
                personal_docs VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
                CONSTRAINT unique_email UNIQUE (email_address)
            )
        `);
        console.log('✔️ Finance table created successfully');

        // Create student table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS student (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                admission_number VARCHAR(8) UNIQUE NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                admission_date DATE NOT NULL,
                roll_number VARCHAR(50),
                class VARCHAR(50) NOT NULL,
                section VARCHAR(50),
                gender VARCHAR(20) NOT NULL,
                religion_status VARCHAR(50) NOT NULL,
                email_address VARCHAR(255),
                mother_tongue VARCHAR(255) NOT NULL,
                languages_known TEXT NOT NULL,
                date_of_birth DATE NOT NULL,
                image VARCHAR(255) NOT NULL,
                blood_group VARCHAR(5) NOT NULL,
                CONSTRAINT unique_admission_number UNIQUE (admission_number)
            )
        `);
        console.log('✔️ Student table created successfully');

        // Create document table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS document (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                document_type VARCHAR(100) NOT NULL,
                document VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Document table created successfully');

        // Create medical history table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS medical_history (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                allergies TEXT,
                medical_condition VARCHAR(50),
                medications TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Medical History table created successfully');

        // Create previous school table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS previous_school (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                school_name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Previous School table created successfully');

        // Create siblings table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS siblings (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                is_sibling_studying_in_same_school VARCHAR(3) NOT NULL,
                sibling_name VARCHAR(255) NOT NULL,
                sibling_roll_no VARCHAR(100) NOT NULL,
                sibling_admission_no VARCHAR(100) NOT NULL,
                sibling_class VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Siblings table created successfully');

        // Create parents table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS parents (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                father_name VARCHAR(255) NOT NULL,
                father_email VARCHAR(255) NOT NULL,
                father_phone VARCHAR(20) NOT NULL,
                father_occupation VARCHAR(255) NOT NULL,
                father_upload VARCHAR(255),
                mother_name VARCHAR(255) NOT NULL,
                mother_email VARCHAR(255) NOT NULL,
                mother_phone VARCHAR(20) NOT NULL,
                mother_occupation VARCHAR(255) NOT NULL,
                mother_upload VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Parents table created successfully');

        // Create teacher table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS teacher (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email_address VARCHAR(255) UNIQUE NOT NULL,
                phone_number VARCHAR(20) UNIQUE NOT NULL,
                date_of_birth DATE NOT NULL,
                gender VARCHAR(20) NOT NULL,
                blood_group VARCHAR(5) NOT NULL,
                address VARCHAR(255) NOT NULL,
                marital_status VARCHAR(50) NOT NULL,
                qualification VARCHAR(255) NOT NULL,
                date_of_joining DATE NOT NULL,
                work_experience INTEGER NOT NULL,
                previous_work VARCHAR(255),
                previous_work_address VARCHAR(255),
                previous_work_phone_number VARCHAR(20),
                work_shift VARCHAR(50) NOT NULL,
                work_location VARCHAR(255) NOT NULL,
                salary INTEGER NOT NULL,
                subject VARCHAR(255) NOT NULL,
                facebook VARCHAR(255),
                instagram VARCHAR(255),
                linkedin VARCHAR(255),
                twitter_url VARCHAR(255),
                resume VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                CONSTRAINT unique_teacher_email UNIQUE (email_address)
            )
        `);
        console.log('✔️ Teacher table created successfully');

        // Create library_manager table

        await db.execute(`
            CREATE TABLE IF NOT EXISTS library_manager (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) UNIQUE NOT NULL,
            image VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            )
            `);
            console.log('✔️ Library Manager table created successfully');

            await db.execute(`
                CREATE TABLE IF NOT EXISTS events (
                    id SERIAL PRIMARY KEY,
                    event_title VARCHAR(255) NOT NULL,
                    event_category VARCHAR(100) CHECK (event_category IN ('celebration', 'training', 'meeting', 'holidays')) NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    attachment VARCHAR(255),
                    message TEXT,
                    target VARCHAR(20) CHECK (target IN ('All', 'Students', 'Staffs')) DEFAULT 'All',
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
                )
            `);
            console.log('✔️ Events table created successfully');

        await db.execute(`
                CREATE TABLE IF NOT EXISTS class (
                    id SERIAL PRIMARY KEY,
                    class_name VARCHAR(100) NOT NULL,
                    class_code VARCHAR(100) UNIQUE NOT NULL,
                    teacher_id INTEGER REFERENCES teacher(id) NOT NULL,
                    student_count INTEGER DEFAULT 0 NOT NULL,
                    status VARCHAR(50) DEFAULT 'active' NOT NULL,
                    section_id INTEGER REFERENCES section(id) ON DELETE CASCADE NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
                )
            `);
         console.log('✔️ Class table created successfully');

         await db.execute(`
            CREATE TABLE IF NOT EXISTS section (
                id SERIAL PRIMARY KEY,
                section_name VARCHAR(50) NOT NULL,
                section_code VARCHAR(100) UNIQUE NOT NULL,
                status VARCHAR(50) DEFAULT 'active' NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Section table created successfully');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS class_routine (
                id SERIAL PRIMARY KEY,
                class_id INTEGER REFERENCES class(id) ON DELETE CASCADE NOT NULL,
                section_id INTEGER REFERENCES section(id) ON DELETE CASCADE NOT NULL,
                subject_id INTEGER REFERENCES subject(id) ON DELETE CASCADE NOT NULL,
                teacher_id INTEGER REFERENCES teacher(id) ON DELETE SET NULL,
                day_of_week VARCHAR(20) NOT NULL, -- Day of the week (e.g., "Monday", "Tuesday")
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled' NOT NULL, -- Status of the class (e.g., "scheduled", "completed", "canceled")
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Class Routine table created successfully');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS subject (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL, -- Name of the subject (e.g., Mathematics, Science)
                code VARCHAR(20) UNIQUE NOT NULL, -- Subject code (e.g., MATH101)
                description TEXT, -- Optional description for the subject
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);

        // Create guardians table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS guardians (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
                guardian_type VARCHAR(50) NOT NULL,
                guardian_name VARCHAR(255) NOT NULL,
                guardian_relation VARCHAR(255) NOT NULL,
                guardian_phone VARCHAR(20) NOT NULL,
                guardian_email VARCHAR(255) NOT NULL,
                guardian_occupation VARCHAR(255) NOT NULL,
                guardian_address VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✔️ Guardians table created successfully');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    }
};

createTables();
