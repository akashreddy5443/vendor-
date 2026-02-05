
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');

// Use the standard pooler connection string, but we might need direct connection for extensions? 
// Usually pooler is fine for DDL if session mode, but let's try. 
// If it fails, I'll fallback to the non-pooling/direct one if I had it, but this one worked for RLS.
const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

const sql = `
-- 1. Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Embeddings Table
CREATE TABLE IF NOT EXISTS product_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  content TEXT, -- Human readable content (Title + Desc + Price etc)
  embedding VECTOR(1536) -- OpenAI embedding size
);

-- 3. Enable RLS on it (optional, but good practice)
ALTER TABLE product_embeddings ENABLE ROW LEVEL SECURITY;

-- 4. Create Similarity Search Function
CREATE OR REPLACE FUNCTION match_products (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  product_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    product_embeddings.id,
    product_embeddings.product_id,
    product_embeddings.content,
    1 - (product_embeddings.embedding <=> query_embedding) AS similarity
  FROM product_embeddings
  WHERE 1 - (product_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY product_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;

async function setupVectorDB() {
    console.log('🔌 Connecting to DB to setup Vector Search...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false, checkServerIdentity: () => undefined }
    });

    try {
        await client.connect();
        console.log('🛠️ Running SQL Migration...');
        await client.query(sql);
        console.log('✅ Vector Extension, Table, and Function created successfully!');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

setupVectorDB();
