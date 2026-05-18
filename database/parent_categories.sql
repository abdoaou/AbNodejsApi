-- Parent categories (MySQL) — run after schema.sql

-- Unique slug per parent-level category (active only)
-- MySQL 8+: functional / filtered indexes vary; enforce in app if this fails on your host:
-- CREATE UNIQUE INDEX uq_categories_parent_slug ON categories (slug, (parent_id IS NULL));

DROP VIEW IF EXISTS parent_categories;
CREATE VIEW parent_categories AS
SELECT
  id,
  name,
  slug,
  image,
  description,
  status,
  created_at,
  updated_at
FROM categories
WHERE parent_id IS NULL
  AND deleted_at IS NULL;
