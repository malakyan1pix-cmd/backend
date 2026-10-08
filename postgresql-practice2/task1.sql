CREATE TABLE authors (
    author_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    country varchar(50) DEFAULT 'Unknown',
    joined_at timestamptz NOT NULL DEFAULT now()
);


-- Check table structure: \d authors
--                                   Table "public.authors"
--  Column   |           Type           | Collation | Nullable |           Default
-------------+--------------------------+-----------+----------+------------------------------
-- author_id | integer                  |           | not null | generated always as identity
-- full_name | text                     |           | not null |
-- email     | text                     |           | not null |
-- country   | character varying(50)    |           |          | 'Unknown'::character varying
-- joined_at | timestamp with time zone |           | not null | now()
--Indexes:
--    "authors_pkey" PRIMARY KEY, btree (author_id)
--    "authors_email_key" UNIQUE CONSTRAINT, btree (email)


-- Insert 3 authors
INSERT INTO authors (full_name, email, country)
VALUES ('George Orwell', 'orwell@example.com', 'United Kingdom');

INSERT INTO authors (full_name, email)
VALUES ('Jane Austen', 'austen@example.com');

INSERT INTO authors (full_name, email, country)
VALUES ('Mark Twain', 'twain@example.com', 'United States');


-- Check inserted data: SELECT * FROM authors;
-- author_id |   full_name   |       email        |    country     |           joined_at           
-------------+---------------+--------------------+----------------+-------------------------------
--         1 | George Orwell | orwell@example.com | United Kingdom | ...
--         2 | Jane Austen   | austen@example.com | Unknown        | ...
--         3 | Mark Twain    | twain@example.com  | United States  | ...
--(3 rows)


-- Duplicate email test:
-- INSERT INTO authors (full_name, email, country)
-- VALUES ('Another Author', 'orwell@example.com', 'France');

-- Expected error:
-- ERROR:  duplicate key value violates unique constraint "authors_email_key"
-- DETAIL:  Key (email)=(orwell@example.com) already exists.