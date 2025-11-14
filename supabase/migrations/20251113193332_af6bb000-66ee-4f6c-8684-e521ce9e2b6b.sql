-- Add policy to allow users to downgrade from subscribed to normal
CREATE POLICY "Users can downgrade to normal role"
ON public.user_roles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND role = 'normal'::app_role);