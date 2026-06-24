-- Database: farnichar_db
-- Generated for XAMPP Import (Full Rebuild - 14 Listings)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- CLEANUP: Drop existing tables in reverse dependency order
-- --------------------------------------------------------
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `favourites`;
DROP TABLE IF EXISTS `listing_images`;
DROP TABLE IF EXISTS `listings`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------
-- TABLE: Users
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@furninest.com', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(2, 'Test User', 'test@test.com', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(3, 'Seller One', 'seller1@example.com', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(4, 'Seller Two', 'seller2@example.com', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(5, 'John Doe', 'john@example.com', NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- --------------------------------------------------------
-- TABLE: Categories
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Chair', 'chair', '🪑', NULL, NOW(), NOW()),
(2, 'Table', 'table', '🪵', NULL, NOW(), NOW()),
(3, 'Bed', 'bed', '🛏️', NULL, NOW(), NOW()),
(4, 'Sofa', 'sofa', '🛋️', NULL, NOW(), NOW()),
(5, 'Wardrobe', 'wardrobe', '🚪', NULL, NOW(), NOW()),
(6, 'Bookshelf', 'bookshelf', '📚', NULL, NOW(), NOW()),
(7, 'Others', 'others', '📦', NULL, NOW(), NOW());

-- --------------------------------------------------------
-- TABLE: Listings
-- --------------------------------------------------------
CREATE TABLE `listings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `condition` enum('new','used','refurbished') COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','sold','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listings_user_id_foreign` (`user_id`),
  KEY `listings_category_id_foreign` (`category_id`),
  CONSTRAINT `listings_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `listings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserting 14 listings (2 per category)

-- 1. Chair (ID: 1)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Leather Arm Chair', 'Premium brown leather chair, perfect for study or office.', 15000.00, 'used', 'Dhaka, Gulshan', 'active', 1, NOW(), NOW()),
(2, 2, 1, 'Wooden Dining Chair', 'Classic teak wood dining chair with comfortable cushion.', 4500.00, 'new', 'Dhaka, Mirpur', 'active', 0, NOW(), NOW());

-- 2. Table (ID: 2)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(3, 3, 2, 'Teak Dining Table', '6-seater teak wood dining table. Solid and durable.', 35000.00, 'used', 'Dhaka, Banani', 'active', 1, NOW(), NOW()),
(4, 4, 2, 'Glass Coffee Table', 'Modern glass top coffee table with wooden legs.', 8500.00, 'new', 'Dhaka, Uttara', 'active', 0, NOW(), NOW());

-- 3. Bed (ID: 3)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(5, 5, 3, 'Queen Size Metal Bed', 'Sturdy iron bed frame, queen size. Easy to assemble.', 12000.00, 'used', 'Chittagong', 'active', 1, NOW(), NOW()),
(6, 1, 3, 'King Size Wooden Bed', 'Luxury king size bed made of mahogany wood.', 45000.00, 'new', 'Dhaka, Dhanmondi', 'active', 1, NOW(), NOW());

-- 4. Sofa (ID: 4)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(7, 2, 4, 'L-Shape Sofa Set', 'Modern grey fabric L-shape sofa. Includes cushions.', 55000.00, 'new', 'Sylhet', 'active', 1, NOW(), NOW()),
(8, 3, 4, '2-Seater Leather Sofa', 'Compact black leather sofa, ideal for small apartments.', 25000.00, 'used', 'Dhaka, Bashundhara', 'active', 0, NOW(), NOW());

-- 5. Wardrobe (ID: 5)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(9, 4, 5, '3-Door Wooden Wardrobe', 'Spacious wardrobe with mirror and lockable drawers.', 28000.00, 'used', 'Rajshahi', 'active', 1, NOW(), NOW()),
(10, 5, 5, 'Modern Sliding Wardrobe', 'Sleek sliding door wardrobe in white finish.', 42000.00, 'new', 'Dhaka, Baridhara', 'active', 0, NOW(), NOW());

-- 6. Bookshelf (ID: 6)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(11, 1, 6, '5-Tier Open Bookshelf', 'Minimalist open bookshelf, great for books and decor.', 6500.00, 'new', 'Dhaka, Farmgate', 'active', 0, NOW(), NOW()),
(12, 2, 6, 'Glass Door Cabinet', 'Wooden cabinet with glass doors for display.', 15000.00, 'used', 'Comilla', 'active', 0, NOW(), NOW());

-- 7. Others (ID: 7)
INSERT INTO `listings` (`id`, `user_id`, `category_id`, `title`, `description`, `price`, `condition`, `location`, `status`, `is_featured`, `created_at`, `updated_at`) VALUES
(13, 3, 7, 'Ironing Board', 'Foldable ironing board with heat resistant cover.', 2500.00, 'used', 'Dhaka, Mohammadpur', 'active', 0, NOW(), NOW()),
(14, 4, 7, 'Shoe Rack', 'Wooden shoe rack, holds up to 12 pairs of shoes.', 3500.00, 'new', 'Khulna', 'active', 0, NOW(), NOW());

-- --------------------------------------------------------
-- TABLE: Listing Images
-- --------------------------------------------------------
CREATE TABLE `listing_images` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `listing_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_images_listing_id_foreign` (`listing_id`),
  CONSTRAINT `listing_images_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserting Images (Strict Mapping)
INSERT INTO `listing_images` (`listing_id`, `image_path`, `created_at`, `updated_at`) VALUES
-- Chair Images
(1, 'listings/cat_chair.jpg', NOW(), NOW()),
(2, 'listings/cat_chair.jpg', NOW(), NOW()),
-- Table Images
(3, 'listings/cat_table.jpg', NOW(), NOW()),
(4, 'listings/cat_table.jpg', NOW(), NOW()),
-- Bed Images
(5, 'listings/cat_bed.jpg', NOW(), NOW()),
(6, 'listings/cat_bed.jpg', NOW(), NOW()),
-- Sofa Images
(7, 'listings/cat_sofa.jpg', NOW(), NOW()),
(8, 'listings/cat_sofa.jpg', NOW(), NOW()),
-- Wardrobe Images
(9, 'listings/cat_wardrobe.jpg', NOW(), NOW()),
(10, 'listings/cat_wardrobe.jpg', NOW(), NOW()),
-- Bookshelf Images
(11, 'listings/cat_bookshelf.jpg', NOW(), NOW()),
(12, 'listings/cat_bookshelf.jpg', NOW(), NOW()),
-- Others Images
(13, 'listings/cat_others.jpg', NOW(), NOW()),
(14, 'listings/cat_others.jpg', NOW(), NOW());

-- --------------------------------------------------------
-- TABLE: Favourites
-- --------------------------------------------------------
CREATE TABLE `favourites` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `listing_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favourites_user_id_listing_id_unique` (`user_id`,`listing_id`),
  KEY `favourites_listing_id_foreign` (`listing_id`),
  CONSTRAINT `favourites_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favourites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- TABLE: Messages
-- --------------------------------------------------------
CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `listing_id` bigint(20) UNSIGNED NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_receiver_id_foreign` (`receiver_id`),
  KEY `messages_listing_id_foreign` (`listing_id`),
  CONSTRAINT `messages_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
