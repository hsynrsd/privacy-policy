-- Create user_policies table to store information about user's accepted policies
CREATE TABLE IF NOT EXISTS public.user_policies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id) NOT NULL,
    policy_name text NOT NULL,
    policy_type text NOT NULL, -- 'privacy_policy', 'terms_of_service', etc.
    business_name text,
    website_url text,
    contact_email text,
    data_collected jsonb,
    last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    policy_content jsonb NOT NULL, -- Stores the full policy content
    UNIQUE(user_id, policy_name, policy_type)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.user_policies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own policies
CREATE POLICY "Users can view own policies" ON public.user_policies
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own policies
CREATE POLICY "Users can insert own policies" ON public.user_policies
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own policies
CREATE POLICY "Users can update own policies" ON public.user_policies
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own policies
CREATE POLICY "Users can delete own policies" ON public.user_policies
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_policies_user_id_idx ON public.user_policies(user_id); 