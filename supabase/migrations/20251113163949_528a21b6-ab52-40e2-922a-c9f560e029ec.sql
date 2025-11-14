-- Add subscription_expires_at to profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX idx_profiles_subscription_expires_at 
ON public.profiles(subscription_expires_at);

-- Add comment
COMMENT ON COLUMN public.profiles.subscription_expires_at IS 'Expiry date and time for Smart Commuter Pass subscription';