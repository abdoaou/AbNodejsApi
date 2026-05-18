-- Parent categories (top-level): rows in `categories` where parent_id IS NULL
-- Run in Supabase → SQL Editor after schema.postgres.sql

-- Fix FK if parent_id was pointed at a parent_categories table/view (subcategories need categories.id)
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE categories
  ADD CONSTRAINT categories_parent_id_fkey
  FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL;

-- Slug must be unique among active parent categories
CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_parent_slug
  ON categories (slug)
  WHERE parent_id IS NULL AND deleted_at IS NULL;

-- Read-only view for reporting / SQL clients
CREATE OR REPLACE VIEW parent_categories AS
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

-- Example: list all parent categories
-- SELECT * FROM parent_categories ORDER BY name;

-- Example: parent with subcategory count
-- SELECT p.*, COUNT(c.id) AS child_count
-- FROM parent_categories p
-- LEFT JOIN categories c ON c.parent_id = p.id AND c.deleted_at IS NULL
-- GROUP BY p.id;
