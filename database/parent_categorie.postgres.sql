-- Aligns with existing Supabase table: parent_categories
-- (If your table is named parent_categorie, rename in src/models/parentCategory.model.js → TABLE)

-- Ensure subcategories reference this table
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE categories
  ADD CONSTRAINT categories_parent_id_fkey
  FOREIGN KEY (parent_id) REFERENCES parent_categories (id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_parent_categories_slug
  ON parent_categories (slug);
