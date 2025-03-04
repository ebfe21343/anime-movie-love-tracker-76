
-- Create a bucket for movie images
INSERT INTO storage.buckets (id, name, public)
VALUES ('movie-images', 'Movie Images Cache', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy for anonymous read access
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'movie-images');

-- Create a policy for authenticated users to upload images
CREATE POLICY "Authenticated Upload" ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'movie-images');

-- Create a policy for authenticated users to update images
CREATE POLICY "Authenticated Update" ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'movie-images');
