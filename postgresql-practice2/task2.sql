CREATE TABLE books (
    book_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id integer NOT NULL REFERENCES authors(author_id),
    title text NOT NULL,
    price numeric(8,2) NOT NULL CHECK (price > 0),
    pages integer CHECK (pages > 0),
    tags text[],
    published_on date NOT NULL
);


-- Check table structure: \d books
--                               Table "public.books"
--    Column    |     Type     | Collation | Nullable |           Default            
----------------+--------------+-----------+----------+------------------------------
-- book_id      | integer      |           | not null | generated always as identity
-- author_id    | integer      |           | not null | 
-- title        | text         |           | not null | 
-- price        | numeric(8,2) |           | not null | 
-- pages        | integer      |           |          | 
-- tags         | text[]       |           |          | 
-- published_on | date         |           | not null | 
--Indexes:
--    "books_pkey" PRIMARY KEY, btree (book_id)
--Check constraints:
--    "books_pages_check" CHECK (pages > 0)
--    "books_price_check" CHECK (price > 0::numeric)
--Foreign-key constraints:
--    "books_author_id_fkey" FOREIGN KEY (author_id) REFERENCES authors(author_id)


-- Insert 5 books
INSERT INTO books (author_id, title, price, pages, tags, published_on)
VALUES
    (1, '1984', 19.99, 328, ARRAY['fiction', 'dystopian'], '1949-06-08'),
    (1, 'Animal Farm', 14.99, 112, ARRAY['fiction', 'political'], '1945-08-17'),
    (2, 'Pride and Prejudice', 17.50, 432, ARRAY['fiction', 'romance'], '1813-01-28'),
    (2, 'Emma', 16.99, 474, ARRAY['fiction', 'romance'], '1815-12-23'),
    (3, 'The Adventures of Tom Sawyer', 12.99, 274, ARRAY['fiction', 'adventure'], '1876-06-01');


-- Check inserted data: SELECT * FROM books;
-- book_id | author_id |            title             | price | pages |        tags         | published_on 
-----------+-----------+------------------------------+-------+-------+---------------------+--------------
--       1 |         1 | 1984                         | 19.99 |   328 | {fiction,dystopian} | 1949-06-08
--       2 |         1 | Animal Farm                  | 14.99 |   112 | {fiction,political} | 1945-08-17
--       3 |         2 | Pride and Prejudice          | 17.50 |   432 | {fiction,romance}   | 1813-01-28
--       4 |         2 | Emma                         | 16.99 |   474 | {fiction,romance}   | 1815-12-23
--       5 |         3 | The Adventures of Tom Sawyer | 12.99 |   274 | {fiction,adventure} | 1876-06-01
--(5 rows)


-- Test CHECK constraint:
-- INSERT INTO books (author_id, title, price, pages, tags, published_on)
-- VALUES (1, 'Invalid Price Book', -5, 100, ARRAY['fiction'], '2026-01-01');

-- Expected error:
-- ERROR:  new row for relation "books" violates check constraint "books_price_check"
-- DETAIL:  Failing row contains (6, 1, Invalid Price Book, -5.00, 100, {fiction}, 2026-01-01).

-- Test FOREIGN KEY constraint:
-- INSERT INTO books (author_id, title, price, pages, tags, published_on)
-- VALUES (9999, 'Invalid Author Book', 10.00, 100, ARRAY['fiction'], '2026-01-01');

-- Expected error:
-- ERROR:  insert or update on table "books" violates foreign key constraint "books_author_id_fkey"
-- DETAIL:  Key (author_id)=(9999) is not present in table "authors".