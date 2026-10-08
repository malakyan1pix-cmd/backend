-- Test query before creating the index:
-- SELECT title FROM books
-- WHERE tags @> ARRAY['fiction'];

--            title             
--------------------------------
-- 1984
-- Animal Farm
-- Pride and Prejudice
-- Emma
-- The Adventures of Tom Sawyer
--(5 rows)


-- Create GIN index:
CREATE INDEX idx_books_tags_gin
ON books USING GIN (tags);

-- Test with EXPLAIN ANALYZE:
-- The sequential scan was disabled temporarily so PostgreSQL
-- could demonstrate the GIN index scan on this small table.
-- SET enable_seqscan = off;

--EXPLAIN ANALYZE SELECT title
--FROM books WHERE tags @> ARRAY['fiction'];


--                                                        QUERY PLAN                                                         
-----------------------------------------------------------------------------------------------------------------------------
-- Bitmap Heap Scan on books  (cost=8.52..12.53 rows=1 width=32) (actual time=0.024..0.025 rows=5 loops=1)
--   Recheck Cond: (tags @> '{fiction}'::text[])
--   Heap Blocks: exact=1
--   ->  Bitmap Index Scan on idx_books_tags_gin  (cost=0.00..8.52 rows=1 width=0) (actual time=0.018..0.018 rows=5 loops=1)
--         Index Cond: (tags @> '{fiction}'::text[])
-- Planning Time: 0.083 ms
-- Execution Time: 0.051 ms
--(7 rows)

-- Restore the default setting:
-- SET enable_seqscan = on;

-- Explanation:
-- A B-tree index is not well suited for this query because
-- the query searches for an individual element inside an array
-- using the @> containment operator. GIN is designed to index
-- individual elements of composite values such as arrays.