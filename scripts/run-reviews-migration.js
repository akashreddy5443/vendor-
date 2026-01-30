const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
    ssl: {
        rejectUnauthorized: false
    }
});

const sql = `
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    author_name TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Public reviews" ON public.reviews FOR SELECT USING (status = 'approved');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can manage reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Admin can manage reviews" ON public.reviews FOR ALL USING (
            EXISTS (
                SELECT 1 FROM users
                WHERE users.id = auth.uid() AND users.role = 'admin'
            )
        );
    END IF;
END
$$;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
`;

async function runMigration() {
    try {
        await client.connect();
        await client.query(sql);
        console.log("Migration executed successfully");
    } catch (err) {
        console.error('Error executing migration', err.stack);
    } finally {
        await client.end();
    }
}

runMigration();
