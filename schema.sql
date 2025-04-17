-- ============================================
-- D1 DATABASE SCHEMA FOR CLOUDFLARE WORKER APP
-- ============================================

-- TABLE: site_visits
-- Purpose:
--   - Stores a simple numeric counter to track the number of times the site has been visited.
--   - Designed to work with a single row (id = 1) for easy updating.
-- Used in:
--   - Cloudflare Worker at /api/visits
-- ============================================
CREATE TABLE IF NOT EXISTS site_visits (
    id INTEGER PRIMARY KEY,          -- Unique row ID (only one row used)
    count INTEGER DEFAULT 0          -- The visit count
);

-- Ensure there's at least one row to update
INSERT OR IGNORE INTO site_visits (id, count) VALUES (1, 0);

-- ============================================
-- TABLE: comments
-- Purpose:
--   - Stores user-submitted comments/messages.
--   - Includes automatic timestamping using CURRENT_TIMESTAMP.
-- Used in:
--   - (Future extension) for a contact form or feedback system.
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,     -- Auto-incrementing unique ID for each comment
    name TEXT NOT NULL,                       -- Name of the commenter
    message TEXT NOT NULL,                    -- The actual comment/message content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the comment was submitted
);
