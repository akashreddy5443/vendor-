require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function deploy() {
    try {
        await client.connect();
        console.log('Connected to DB');

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

      ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
      
      -- Admin can do anything
      DROP POLICY IF EXISTS "Admin full access" ON public.reviews;
      CREATE POLICY "Admin full access" ON public.reviews USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );

      -- Public can read approved reviews
      DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
      CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (status = 'approved');

      -- Users can insert their own reviews
      DROP POLICY IF EXISTS "Users create reviews" ON public.reviews;
      CREATE POLICY "Users create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
    `;

        await client.query(sql);
        console.log('Reviews table created successfully!');
    } catch (err) {
        console.error('Error deploying migration:', err);
    } finally {
        await client.end();
    }
}

deploy();
