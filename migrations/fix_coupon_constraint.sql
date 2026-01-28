-- Drop valid constraints if they exist
ALTER TABLE public.coupons DROP CONSTRAINT IF EXISTS coupons_discount_type_check;

-- Add cleaner constraint (ensure text matches)
ALTER TABLE public.coupons ADD CONSTRAINT coupons_discount_type_check 
    CHECK (discount_type::text = ANY (ARRAY['percent'::text, 'fixed'::text]));
