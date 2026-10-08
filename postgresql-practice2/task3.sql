CREATE INDEX idx_books_published_on
ON books USING btree (published_on);

-- Test index with EXPLAIN ANALYZE:
-- EXPLAIN ANALYZE SELECT * FROM books 
-- WHERE published_on
-- BETWEEN '2020-01-01' AND '2020-12-31';

-- EXPLAIN ANALYZE output:
--                                           QUERY PLAN                                           
--------------------------------------------------------------------------------------------------
-- Seq Scan on books  (cost=0.00..1.07 rows=1 width=94) (actual time=0.008..0.008 rows=0 loops=1)
--   Filter: ((published_on >= '2020-01-01'::date) AND (published_on <= '2020-12-31'::date))
--   Rows Removed by Filter: 5
-- Planning Time: 0.100 ms
-- Execution Time: 0.019 ms
--(5 rows)


-- Check index: \di
--                      List of relations
-- Schema |          Name          | Type  |  Owner   |  Table  
----------+------------------------+-------+----------+---------
-- public | authors_email_key      | index | postgres | authors
-- public | authors_pkey           | index | postgres | authors
-- public | books_pkey             | index | postgres | books
-- public | idx_books_published_on | index | postgres | books
--(4 rows)


-- Note:
-- PostgreSQL uses a Sequential Scan because the books table is very small.
-- An Index Scan is not necessary for only a few rows.