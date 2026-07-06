CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  material TEXT,
  size TEXT,
  description TEXT,
  image_url TEXT,
  model_url TEXT,
  is_public INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_artworks_public_sort ON artworks(is_public, sort_order, created_at);
