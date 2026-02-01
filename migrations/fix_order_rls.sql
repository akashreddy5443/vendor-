-- Allow users to update their own orders (specifically for cancellation)
-- First, drop any conflicting restrictive policies if they exist, or just ensure this one permits the update.

BEGIN;

-- Policy to allow users to update their own orders
-- We can be specific: only allow updating 'status' to 'cancelled' if we wanted, 
-- but generally allowing users to update their own records is fine if the application logic (server action) handles the validation.
-- However, RLS is the last line of defense.

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

CREATE POLICY "Users can update their own orders"
ON orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

COMMIT;
