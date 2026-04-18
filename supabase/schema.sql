-- LastBite Database Schema
-- OSU food deals marketplace

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_type AS ENUM ('student', 'business');
CREATE TYPE listing_category AS ENUM ('food', 'grocery', 'retail', 'other');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE profiles (
  id            uuid PRIMARY KEY,
  email         text NOT NULL,
  name          text NOT NULL,
  user_type     user_type NOT NULL DEFAULT 'student',
  business_name text,
  business_address text,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE listings (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id        uuid NOT NULL REFERENCES profiles(id),
  title              text NOT NULL,
  description        text,
  photo_url          text,
  category           listing_category NOT NULL DEFAULT 'food',
  original_price     numeric(10,2) NOT NULL,
  deal_price         numeric(10,2) NOT NULL,
  quantity_total     integer NOT NULL CHECK (quantity_total > 0),
  quantity_remaining integer NOT NULL CHECK (quantity_remaining >= 0),
  expires_at         timestamptz NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE claims (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, user_id)
);

CREATE TABLE favorites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL,
  listing_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

-- RLS disabled for demo simplicity
-- In production, enable RLS with proper policies

-- ============================================================
-- FUNCTION: claim_deal
-- Atomically decrements quantity_remaining and inserts a claim.
-- Raises exception if sold out or already claimed.
-- ============================================================

CREATE OR REPLACE FUNCTION claim_deal(p_listing_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_remaining integer;
BEGIN
  -- Lock the listing row to prevent race conditions
  SELECT quantity_remaining INTO v_remaining
    FROM listings
   WHERE id = p_listing_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF v_remaining <= 0 THEN
    RAISE EXCEPTION 'This deal is sold out';
  END IF;

  -- Check if user already claimed this deal
  IF EXISTS (
    SELECT 1 FROM claims
     WHERE listing_id = p_listing_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'You have already claimed this deal';
  END IF;

  -- Decrement quantity
  UPDATE listings
     SET quantity_remaining = quantity_remaining - 1
   WHERE id = p_listing_id;

  -- Insert the claim
  INSERT INTO claims (listing_id, user_id)
  VALUES (p_listing_id, p_user_id);
END;
$$;

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE listings;
