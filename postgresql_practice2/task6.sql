ALTER TABLE authors
ADD COLUMN website text;

UPDATE authors
SET website = 'https://orwell.example.com'
WHERE author_id = 1;

UPDATE authors
SET website = 'https://austen.example.com'
WHERE author_id = 2;

ALTER TABLE authors
ADD CONSTRAINT website_is_secure
CHECK (website IS NULL OR website LIKE 'https://%');


--  \d authors
--                                   Table "public.authors"
--  Column   |           Type           | Collation | Nullable |           Default            
-------------+--------------------------+-----------+----------+------------------------------
-- author_id | integer                  |           | not null | generated always as identity
-- full_name | text                     |           | not null | 
-- email     | text                     |           | not null | 
-- country   | character varying(50)    |           |          | 'Unknown'::character varying
-- joined_at | timestamp with time zone |           | not null | now()
-- website   | text                     |           |          | 
--Indexes:
--    "authors_pkey" PRIMARY KEY, btree (author_id)
--    "authors_email_key" UNIQUE CONSTRAINT, btree (email)
--Check constraints:
--    "website_is_secure" CHECK (website IS NULL OR website ~~ 'https://%'::text)
--Referenced by:
--    TABLE "book_signings" CONSTRAINT "book_signings_author_id_fkey" FOREIGN KEY (author_id) REFERENCES authors(author_id)
--    TABLE "books" CONSTRAINT "books_author_id_fkey" FOREIGN KEY (author_id) REFERENCES authors(author_id)


--INSERT INTO authors (full_name, email, website)
--VALUES ('Test Author', 'test@example.com', 'http://insecure.example.com');


--ERROR:  new row for relation "authors" violates check constraint "website_is_secure"
--DETAIL:  Failing row contains (9, Test Author, test@example.com, Unknown, 2026-10-03 03:01:29.307246+04, http://insecure.example.com).