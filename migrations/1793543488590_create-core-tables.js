/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
            CREATE TABLE classes (
                id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name varchar(100) NOT NULL UNIQUE,
                created_at timestamptz NOT NULL DEFAULT now()
            );

            CREATE TABLE users (
                id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name varchar(100) NOT NULL,
                email varchar(255) NOT NULL UNIQUE,
                password_hash varchar(255) NOT NULL,
                role varchar(10) NOT NULL CHECK (role IN ('learner', 'teacher')),
                class_id integer REFERENCES classes(id) ON DELETE SET NULL,
                created_at timestamptz NOT NULL DEFAULT now()
            );

            CREATE TABLE topics (
                id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name varchar(100) NOT NULL UNIQUE
            );

            CREATE TABLE questions (
                id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                topic_id integer NOT NULL REFERENCES topics(id),
                question_text text NOT NULL,
                option_a text NOT NULL,
                option_b text NOT NULL,
                option_c text NOT NULL,
                option_d text NOT NULL,
                correct_option char(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
                difficulty varchar(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
                source_year integer,
                status varchar(10) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved')),
                created_by integer REFERENCES users(id) ON DELETE SET NULL,
                created_at timestamptz NOT NULL DEFAULT now()
            );

            CREATE INDEX idx_questions_topic ON questions(topic_id);
            CREATE INDEX idx_questions_status ON questions(status);
            CREATE INDEX idx_users_class ON users(class_id);
        `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS questions;
        DROP TABLE IF EXISTS topics;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS classes;
        `);
};
