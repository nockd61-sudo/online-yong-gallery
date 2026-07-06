CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'YONGRYEON',
  year TEXT,
  material TEXT,
  size TEXT,
  description TEXT,
  image_url TEXT,
  model_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_artworks_public_order ON artworks(is_public, sort_order, created_at);
