-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE reward_type AS ENUM ('nft', 'jetton', 'xp_only');
CREATE TYPE proof_type AS ENUM ('tx_hash', 'pr_url', 'manual_input');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE gift_type AS ENUM ('ton', 'jetton', 'nft');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    github_username TEXT UNIQUE NOT NULL,
    wallet_address TEXT UNIQUE,
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    avatar_url TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward_xp INTEGER NOT NULL CHECK (reward_xp > 0),
    reward_type reward_type NOT NULL DEFAULT 'xp_only',
    nft_slug TEXT,
    proof_type proof_type NOT NULL DEFAULT 'manual_input',
    category TEXT DEFAULT 'general',
    difficulty TEXT DEFAULT 'beginner',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quest submissions table
CREATE TABLE quest_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    proof TEXT NOT NULL,
    status submission_status DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
);

-- Gifts table
CREATE TABLE gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gift_type gift_type NOT NULL,
    amount NUMERIC(20, 9) CHECK (amount > 0),
    nft_slug TEXT,
    message TEXT,
    tx_hash TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (sender_id != receiver_id),
    CHECK (
        (gift_type = 'nft' AND nft_slug IS NOT NULL AND amount IS NULL) OR
        (gift_type IN ('ton', 'jetton') AND amount IS NOT NULL AND nft_slug IS NULL)
    )
);

-- NFT mints table
CREATE TABLE nft_mints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests(id) ON DELETE SET NULL,
    nft_slug TEXT NOT NULL,
    tx_hash TEXT,
    metadata JSONB,
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table (for tracking various milestones)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_data JSONB,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Indexes for performance
CREATE INDEX idx_users_github_username ON users(github_username);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_xp ON users(xp DESC);
CREATE INDEX idx_quest_submissions_user_id ON quest_submissions(user_id);
CREATE INDEX idx_quest_submissions_quest_id ON quest_submissions(quest_id);
CREATE INDEX idx_quest_submissions_status ON quest_submissions(status);
CREATE INDEX idx_gifts_sender_id ON gifts(sender_id);
CREATE INDEX idx_gifts_receiver_id ON gifts(receiver_id);
CREATE INDEX idx_nft_mints_user_id ON nft_mints(user_id);
CREATE INDEX idx_nft_mints_quest_id ON nft_mints(quest_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_mints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR github_username = current_setting('app.current_user', true));

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can view public user data" ON users
    FOR SELECT USING (true);

-- RLS Policies for quest_submissions table
CREATE POLICY "Users can view their own submissions" ON quest_submissions
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own submissions" ON quest_submissions
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all submissions" ON quest_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND github_username IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admins can update submissions" ON quest_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND github_username IN ('admin', 'moderator')
        )
    );

-- RLS Policies for gifts table
CREATE POLICY "Users can view gifts they sent or received" ON gifts
    FOR SELECT USING (
        sender_id::text = auth.uid()::text OR 
        receiver_id::text = auth.uid()::text
    );

CREATE POLICY "Users can send gifts" ON gifts
    FOR INSERT WITH CHECK (sender_id::text = auth.uid()::text);

-- RLS Policies for nft_mints table
CREATE POLICY "Users can view their own NFTs" ON nft_mints
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Anyone can view NFT collection data" ON nft_mints
    FOR SELECT USING (true);

-- RLS Policies for user_achievements table
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Anyone can view public achievements" ON user_achievements
    FOR SELECT USING (true);

-- Functions for common operations

-- Get user profile by GitHub username
CREATE OR REPLACE FUNCTION get_user_profile(username TEXT)
RETURNS TABLE (
    id UUID,
    github_username TEXT,
    wallet_address TEXT,
    xp INTEGER,
    streak INTEGER,
    joined_at TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    quest_count BIGINT,
    nft_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.github_username,
        u.wallet_address,
        u.xp,
        u.streak,
        u.joined_at,
        u.avatar_url,
        COALESCE(qs.quest_count, 0) as quest_count,
        COALESCE(nm.nft_count, 0) as nft_count
    FROM users u
    LEFT JOIN (
        SELECT user_id, COUNT(*) as quest_count
        FROM quest_submissions
        WHERE status = 'approved'
        GROUP BY user_id
    ) qs ON u.id = qs.user_id
    LEFT JOIN (
        SELECT user_id, COUNT(*) as nft_count
        FROM nft_mints
        GROUP BY user_id
    ) nm ON u.id = nm.user_id
    WHERE u.github_username = username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user quests with status
CREATE OR REPLACE FUNCTION get_user_quests(user_uuid UUID)
RETURNS TABLE (
    quest_id UUID,
    title TEXT,
    description TEXT,
    reward_xp INTEGER,
    reward_type reward_type,
    category TEXT,
    difficulty TEXT,
    submission_status submission_status,
    submitted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id as quest_id,
        q.title,
        q.description,
        q.reward_xp,
        q.reward_type,
        q.category,
        q.difficulty,
        COALESCE(qs.status, 'not_started'::submission_status) as submission_status,
        qs.submitted_at
    FROM quests q
    LEFT JOIN quest_submissions qs ON q.id = qs.quest_id AND qs.user_id = user_uuid
    WHERE q.is_active = true
    ORDER BY q.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Submit quest proof
CREATE OR REPLACE FUNCTION submit_quest_proof(
    user_uuid UUID,
    quest_uuid UUID,
    proof_text TEXT
)
RETURNS UUID AS $$
DECLARE
    submission_id UUID;
BEGIN
    INSERT INTO quest_submissions (user_id, quest_id, proof)
    VALUES (user_uuid, quest_uuid, proof_text)
    RETURNING id INTO submission_id;
    
    RETURN submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    rank BIGINT,
    user_id UUID,
    github_username TEXT,
    wallet_address TEXT,
    avatar_url TEXT,
    xp INTEGER,
    quest_count BIGINT,
    nft_count BIGINT,
    streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY u.xp DESC) as rank,
        u.id as user_id,
        u.github_username,
        u.wallet_address,
        u.avatar_url,
        u.xp,
        COALESCE(qs.quest_count, 0) as quest_count,
        COALESCE(nm.nft_count, 0) as nft_count,
        u.streak
    FROM users u
    LEFT JOIN (
        SELECT user_id, COUNT(*) as quest_count
        FROM quest_submissions
        WHERE status = 'approved'
        GROUP BY user_id
    ) qs ON u.id = qs.user_id
    LEFT JOIN (
        SELECT user_id, COUNT(*) as nft_count
        FROM nft_mints
        GROUP BY user_id
    ) nm ON u.id = nm.user_id
    ORDER BY u.xp DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user gifts
CREATE OR REPLACE FUNCTION get_user_gifts(user_uuid UUID)
RETURNS TABLE (
    gift_id UUID,
    sender_username TEXT,
    receiver_username TEXT,
    gift_type gift_type,
    amount NUMERIC,
    nft_slug TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    is_sender BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id as gift_id,
        sender.github_username as sender_username,
        receiver.github_username as receiver_username,
        g.gift_type,
        g.amount,
        g.nft_slug,
        g.message,
        g.created_at,
        (g.sender_id = user_uuid) as is_sender
    FROM gifts g
    JOIN users sender ON g.sender_id = sender.id
    JOIN users receiver ON g.receiver_id = receiver.id
    WHERE g.sender_id = user_uuid OR g.receiver_id = user_uuid
    ORDER BY g.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mint NFT badge
CREATE OR REPLACE FUNCTION mint_nft_badge(
    user_uuid UUID,
    quest_uuid UUID,
    nft_slug_param TEXT,
    tx_hash_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    mint_id UUID;
BEGIN
    INSERT INTO nft_mints (user_id, quest_id, nft_slug, tx_hash)
    VALUES (user_uuid, quest_uuid, nft_slug_param, tx_hash_param)
    RETURNING id INTO mint_id;
    
    RETURN mint_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user XP and handle level progression
CREATE OR REPLACE FUNCTION update_user_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    current_xp INTEGER;
    new_xp INTEGER;
    current_level INTEGER;
    new_level INTEGER;
BEGIN
    SELECT xp INTO current_xp FROM users WHERE id = user_uuid;
    new_xp := current_xp + xp_amount;
    
    -- Simple level calculation: level = floor(xp / 200)
    current_level := floor(current_xp / 200);
    new_level := floor(new_xp / 200);
    
    UPDATE users 
    SET xp = new_xp, last_active = NOW()
    WHERE id = user_uuid;
    
    -- If level increased, record achievement
    IF new_level > current_level THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_data)
        VALUES (user_uuid, 'level_up', jsonb_build_object('level', new_level, 'previous_level', current_level))
        ON CONFLICT (user_id, achievement_type) DO UPDATE
        SET achievement_data = jsonb_build_object('level', new_level, 'previous_level', current_level),
            earned_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed data for quests
INSERT INTO quests (title, description, reward_xp, reward_type, nft_slug, proof_type, category, difficulty) VALUES
('Deploy Your First Smart Contract', 'Create and deploy a simple smart contract on TON testnet using FunC', 500, 'nft', 'first-contract', 'tx_hash', 'beginner', 'beginner'),
('Contribute to TON Documentation', 'Submit a meaningful PR to improve TON developer documentation', 300, 'xp_only', NULL, 'pr_url', 'community', 'beginner'),
('Build a DeFi Protocol', 'Create a decentralized finance application on TON blockchain', 1000, 'nft', 'defi-builder', 'manual_input', 'advanced', 'advanced'),
('Create NFT Collection', 'Launch your own NFT collection on TON with metadata and marketplace integration', 750, 'nft', 'nft-creator', 'tx_hash', 'intermediate', 'intermediate'),
('Write TON Tutorial', 'Create a comprehensive tutorial for TON development', 400, 'xp_only', NULL, 'pr_url', 'community', 'intermediate'),
('Optimize Gas Usage', 'Demonstrate gas optimization techniques in your smart contracts', 600, 'nft', 'gas-optimizer', 'manual_input', 'intermediate', 'intermediate');
