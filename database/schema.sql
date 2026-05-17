-- Multi-website ecommerce schema (MySQL 8+ recommended)
-- Charset: utf8mb4 for full Unicode support

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS websites (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_websites_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id INT UNSIGNED NULL,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  image VARCHAR(512) NULL,
  description TEXT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_categories_parent (parent_id),
  KEY idx_categories_deleted (deleted_at),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  website_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NULL,
  parent_category_id INT UNSIGNED NULL,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  description TEXT NULL,
  short_description VARCHAR(512) NULL,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(12, 2) NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  sku VARCHAR(120) NOT NULL,
  image VARCHAR(512) NULL,
  status ENUM('draft', 'active', 'inactive') NOT NULL DEFAULT 'draft',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_website_slug (website_id, slug),
  KEY idx_products_website (website_id),
  KEY idx_products_category (category_id),
  KEY idx_products_parent_category (parent_category_id),
  KEY idx_products_status (status),
  KEY idx_products_featured (featured),
  KEY idx_products_deleted (deleted_at),
  CONSTRAINT fk_products_website FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE RESTRICT,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT fk_products_parent_category FOREIGN KEY (parent_category_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed website + admin (password: Admin@123 — change immediately in production)
INSERT INTO websites (name, slug)
VALUES ('Main Store', 'main-store')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO admins (username, email, password)
VALUES (
  'admin',
  'admin@example.com',
  '$2b$10$ql.ldkYGM87grtijC7KcBOEHPoVLx2CyWiUuTazSbEmo2Bx/a1oV2'
)
ON DUPLICATE KEY UPDATE email = VALUES(email);
