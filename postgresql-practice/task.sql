-- Task 1: Create a Role Without Login Privilege

CREATE ROLE library_guest;

-- Check: \du
-- library_guest is shown with "Cannot login".

-- Check: psql -U library_guest
-- Connection fails because LOGIN is disabled.


-- Task 2: Create a Role With Login and Verify It Works

CREATE ROLE library_staff LOGIN PASSWORD '<password>';

-- Check: \du
-- library_staff can log in.

-- Check: psql -h localhost -U library_staff -d postgres
-- Login was successful.

-- library_guest cannot log in because LOGIN is disabled.
-- library_staff can log in because LOGIN is enabled and a password is set.


-- Task 3: Create a New Database

CREATE DATABASE library_db;

-- Check: \l
-- library_db was created successfully.


-- Task 4: Create a Table Using Multiple Data Types

CREATE TABLE books (
    book_id integer,
    title text,
    author varchar(100),
    price numeric(10,2),
    in_stock boolean,
    published_on date,
    added_at timestamptz
);
-- Check: \d books

--price — numeric(10,2), because it stores exact monetary values with two decimal places.
--in_stock — boolean, because the field can have only two logical values: true or false.
--added_at — timestamptz, because it stores the exact date and time with time zone information.


-- Task 5: Insert Data and Inspect the Table

INSERT INTO books 
(book_id, title, author, price, in_stock, published_on, added_at) 
VALUES 
(1, 'The Hobbit', 'J.R.R. Tolkien', 24.99, true, '1937-09-21', '2026-10-01 10:00:00+04');

INSERT INTO books 
(book_id, title, author, price, in_stock, published_on, added_at) 
VALUES 
(2, '1984', 'George Orwell', 19.99, false, '1949-06-08', '2026-10-01 10:05:00+04');

INSERT INTO books 
(book_id, title, author, price, in_stock, published_on, added_at) 
VALUES 
(3, 'Pride and Prejudice', 'Jane Austen', 17.50, true, '1813-01-28', '2026-10-01 10:10:00+04');

SELECT * FROM books;

SELECT title, price
FROM books
WHERE in_stock = true;

-- Check roles:
-- \du


-- Task 6: Grant a Limited Privilege

GRANT SELECT ON TABLE books TO library_staff;

-- library_staff can read books with SELECT,
-- but cannot add rows because INSERT permission was not granted.

-- Check as library_staff:
--SELECT * FROM books;
-- SELECT succeeds.

-- Check as library_staff:
--INSERT INTO books 
--(book_id, title, author, price, in_stock, published_on, added_at)
--VALUES
--(4, 'Dune', 'Frank Herbert', 22.99, true, '1965-06-01', '2026-10-01 10:15:00+04');
-- INSERT fails with "permission denied for table books".