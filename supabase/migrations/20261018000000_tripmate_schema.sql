-- TRIPMATE AI Database Schema
-- Supports pgvector for semantic retrieval, full-text search (tsvector) for keyword hybrid RAG,
-- and comprehensive trip planning, budgeting, collaboration and expenses.

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  home_city TEXT DEFAULT 'Bengaluru',
  preferred_currency TEXT DEFAULT 'INR',
  dietary_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  destination TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT NOT NULL,
  nights INT NOT NULL,
  group_size INT NOT NULL DEFAULT 1,
  total_budget NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_demo BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Trip Members (Group Collaboration)
CREATE TABLE IF NOT EXISTS trip_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'MEMBER')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Itinerary Days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Itinerary Items (Activities, Sightseeing, Food, Transport)
CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('ACTIVITY', 'MEAL', 'TRANSPORT', 'REST', 'CHECK_IN', 'CHECK_OUT', 'SIGHTSEEING')),
  time_slot TEXT NOT NULL CHECK (time_slot IN ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  individual_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  group_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_approved BOOLEAN DEFAULT TRUE,
  is_locked BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'TripMate Verified Directory',
  source_url TEXT,
  provenance TEXT DEFAULT 'LIVE_VERIFIED',
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  booking_url TEXT,
  weather_sensitive BOOLEAN DEFAULT FALSE,
  indoor_alternative TEXT,
  walking_intensity TEXT DEFAULT 'MODERATE',
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Selected Accommodations
CREATE TABLE IF NOT EXISTS trip_hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating NUMERIC(3,1) DEFAULT 4.5,
  review_count INT DEFAULT 120,
  price_per_night NUMERIC(10,2) NOT NULL,
  max_occupancy_per_room INT NOT NULL DEFAULT 2,
  required_rooms INT NOT NULL DEFAULT 1,
  total_nights INT NOT NULL,
  total_stay_cost NUMERIC(12,2) NOT NULL,
  per_person_stay_cost NUMERIC(10,2) NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  meal_included BOOLEAN DEFAULT FALSE,
  cancellation_policy TEXT,
  image_url TEXT,
  booking_url TEXT,
  provenance TEXT DEFAULT 'LIVE_VERIFIED',
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Group Shared Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('TRANSPORT', 'STAY', 'FOOD', 'ACTIVITY', 'MISC')),
  payer_id UUID NOT NULL,
  payer_name TEXT NOT NULL,
  date DATE NOT NULL,
  split_mode TEXT DEFAULT 'EQUAL' CHECK (split_mode IN ('EQUAL', 'CUSTOM')),
  allocations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Group Member Votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  member_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('ITEM', 'HOTEL', 'DESTINATION')),
  target_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('UP', 'DOWN')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. What-If Scenarios
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  extra_days INT DEFAULT 0,
  extra_friends INT DEFAULT 0,
  stay_tier TEXT DEFAULT 'CURRENT',
  transport_change TEXT DEFAULT 'KEEP',
  simulated_budget JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RAG Knowledge Documents
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  destination TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  provider_reference TEXT,
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  freshness_status TEXT DEFAULT 'FRESH' CHECK (freshness_status IN ('FRESH', 'EXPIRING_SOON', 'STALE')),
  licensing_notice TEXT,
  structured_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RAG Knowledge Chunks with Vector Embeddings and Full-Text Search
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  destination TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  embedding vector(1536), -- Compatible with OpenAI / Gemini vector dimensions
  fts_tokens tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content || ' ' || destination || ' ' || category)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_trip ON itinerary_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_day ON itinerary_items(day_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_dest ON knowledge_chunks(destination);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts ON knowledge_chunks USING GIN(fts_tokens);

-- Vector index (HNSW for high-performance cosine similarity)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding 
ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Hybrid Search Match Function
CREATE OR REPLACE FUNCTION match_knowledge_chunks (
  query_embedding vector(1536),
  query_text TEXT,
  filter_destination TEXT DEFAULT NULL,
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  destination TEXT,
  source_name TEXT,
  source_url TEXT,
  verified_at TIMESTAMPTZ,
  similarity FLOAT,
  rank_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.document_id,
    kc.title,
    kc.content,
    kc.category,
    kc.destination,
    kc.source_name,
    kc.source_url,
    kc.verified_at,
    (1 - (kc.embedding <=> query_embedding)) AS similarity,
    ts_rank(kc.fts_tokens, plainto_tsquery('english', query_text)) AS rank_score
  FROM knowledge_chunks kc
  WHERE
    (filter_destination IS NULL OR LOWER(kc.destination) = LOWER(filter_destination))
    AND (1 - (kc.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY (0.7 * (1 - (kc.embedding <=> query_embedding)) + 0.3 * ts_rank(kc.fts_tokens, plainto_tsquery('english', query_text))) DESC
  LIMIT match_count;
END;
$$;

-- Enable Row-Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policy: Users can view trips they own or belong to
CREATE POLICY "Users can access their own trips"
  ON trips FOR ALL
  USING (auth.uid() = user_id OR is_demo = TRUE);

CREATE POLICY "Users can access their itinerary days"
  ON itinerary_days FOR ALL
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND (trips.user_id = auth.uid() OR trips.is_demo = TRUE)));
