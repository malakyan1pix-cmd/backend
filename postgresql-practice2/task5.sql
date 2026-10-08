CREATE TABLE book_signings (
    signing_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id integer NOT NULL REFERENCES authors(author_id),
    store_location text NOT NULL,
    during tstzrange NOT NULL);


CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE book_signings
ADD CONSTRAINT no_overlapping_signings
EXCLUDE USING gist (
    author_id WITH =,
    during WITH &&
);


INSERT INTO book_signings (author_id, store_location, during)
VALUES (1, 'Bookstore Central', '[2026-03-01 14:00:00+04, 2026-03-01 16:00:00+04)');
-- Result: INSERT 0 1

-- INSERT INTO book_signings (author_id, store_location, during)
-- VALUES (1, 'Bookstore North', '[2026-03-01 15:00:00+04, 2026-03-01 17:00:00+04)');

-- ERROR:  conflicting key value violates exclusion constraint "no_overlapping_signings"
-- DETAIL:  Key (author_id, during)=(1, ["2026-03-01 15:00:00+04","2026-03-01 17:00:00+04")) 
-- conflicts with existing key (author_id, during)=(1, ["2026-03-01 14:00:00+04","2026-03-01 16:00:00+04")).


INSERT INTO book_signings (author_id, store_location, during)
VALUES (2, 'Bookstore North', '[2026-03-01 15:00:00+04, 2026-03-01 17:00:00+04)');
-- Result: INSERT 0 1

-- SELECT * FROM book_signings;
--
-- signing_id | author_id |  store_location   |                       during                        
--------------+-----------+-------------------+-----------------------------------------------------
--          1 |         1 | Bookstore Central | ["2026-03-01 14:00:00+04","2026-03-01 16:00:00+04")
--          4 |         2 | Bookstore North   | ["2026-03-01 15:00:00+04","2026-03-01 17:00:00+04")
--(2 rows)