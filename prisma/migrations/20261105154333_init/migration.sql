-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `summary` VARCHAR(255) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `linkedin_url` VARCHAR(500) NOT NULL,
    `github_url` VARCHAR(500) NOT NULL,
    `github_account` VARCHAR(39) NULL,
    `github_account_type` ENUM('USER', 'ORGANIZATION') NOT NULL DEFAULT 'USER',
    `availability` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `kicker` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `summary` TEXT NOT NULL,
    `lead` TEXT NOT NULL,
    `period_label` VARCHAR(120) NULL,
    `role` VARCHAR(191) NULL,
    `focus` VARCHAR(255) NOT NULL,
    `reading_time` VARCHAR(64) NOT NULL,
    `takeaway` TEXT NOT NULL,
    `theme` ENUM('CIVIC', 'ENGINEERING', 'EDUCATION') NOT NULL,
    `image_alt` TEXT NOT NULL,
    `caption` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_status_sort_order_idx`(`status`, `sort_order`),
    UNIQUE INDEX `projects_author_id_sort_order_key`(`author_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_sections` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `project_sections_project_id_position_key`(`project_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_paragraphs` (
    `id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `body` TEXT NOT NULL,

    UNIQUE INDEX `project_paragraphs_section_id_position_key`(`section_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_evidence` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `label` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `project_evidence_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_quotes` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `attribution` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `project_quotes_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `background_items` (
    `id` VARCHAR(191) NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `kind` ENUM('EXPERIENCE', 'EDUCATION') NOT NULL,
    `position` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `organization` VARCHAR(255) NOT NULL,
    `period_label` VARCHAR(120) NULL,
    `body` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `background_items_profile_id_position_key`(`profile_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credentials` (
    `id` VARCHAR(191) NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `issuer` VARCHAR(255) NOT NULL,
    `valid_through` DATE NULL,
    `score` VARCHAR(32) NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `credentials_profile_id_position_key`(`profile_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` VARCHAR(191) NOT NULL,
    `profile_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `skills_profile_id_position_key`(`profile_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_showcase_entries` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL,
    `repository_full_name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(120) NULL,
    `description_override` TEXT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `github_showcase_entries_project_id_key`(`project_id`),
    UNIQUE INDEX `github_showcase_entries_repository_full_name_key`(`repository_full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_allowed_hosts` (
    `id` VARCHAR(191) NOT NULL,
    `entry_id` VARCHAR(191) NOT NULL,
    `host` VARCHAR(255) NOT NULL,
    `position` INTEGER NOT NULL,

    UNIQUE INDEX `github_allowed_hosts_entry_id_host_key`(`entry_id`, `host`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_snapshots` (
    `id` VARCHAR(191) NOT NULL,
    `entry_id` VARCHAR(191) NOT NULL,
    `github_repository_id` BIGINT NOT NULL,
    `description` TEXT NULL,
    `homepage_url` VARCHAR(500) NULL,
    `language` VARCHAR(100) NULL,
    `repository_updated_at` DATETIME(3) NOT NULL,
    `archived` BOOLEAN NOT NULL,
    `fork` BOOLEAN NOT NULL,
    `checked_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `github_snapshots_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `github_topics` (
    `id` VARCHAR(191) NOT NULL,
    `snapshot_id` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `name` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `github_topics_snapshot_id_position_key`(`snapshot_id`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_sections` ADD CONSTRAINT `project_sections_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_paragraphs` ADD CONSTRAINT `project_paragraphs_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `project_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_evidence` ADD CONSTRAINT `project_evidence_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_quotes` ADD CONSTRAINT `project_quotes_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `background_items` ADD CONSTRAINT `background_items_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills` ADD CONSTRAINT `skills_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `github_showcase_entries` ADD CONSTRAINT `github_showcase_entries_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `github_allowed_hosts` ADD CONSTRAINT `github_allowed_hosts_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `github_showcase_entries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `github_snapshots` ADD CONSTRAINT `github_snapshots_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `github_showcase_entries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `github_topics` ADD CONSTRAINT `github_topics_snapshot_id_fkey` FOREIGN KEY (`snapshot_id`) REFERENCES `github_snapshots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
