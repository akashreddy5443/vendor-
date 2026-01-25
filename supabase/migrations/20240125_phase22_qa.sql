-- Create Product Questions Table
CREATE TABLE IF NOT EXISTS product_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL CHECK (char_length(question) > 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Product Answers Table
CREATE TABLE IF NOT EXISTS product_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES product_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answer TEXT NOT NULL CHECK (char_length(answer) > 2),
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_answers ENABLE ROW LEVEL SECURITY;

-- Policies for Questions
CREATE POLICY "Public questions are viewable by everyone" 
  ON product_questions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can ask questions" 
  ON product_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for Answers
CREATE POLICY "Public answers are viewable by everyone" 
  ON product_answers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can answer questions" 
  ON product_answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE product_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE product_answers;
