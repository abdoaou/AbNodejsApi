-- Fix duplicate SKU errors when saving product sizes (run in Supabase SQL Editor)

ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_sku_key;

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variants_product_sku_active
  ON product_variants (product_id, sku)
  WHERE deleted_at IS NULL AND sku IS NOT NULL;
