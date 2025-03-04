
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieCollection, removeMovieFromCollection } from '@/lib/api';
import { Movie } from '@/types/movie';
import Header from '@/components/Header';
import MovieDetail from '@/components/MovieDetail';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { clearImageCache, getCacheSize } from '@/lib/utils/image-cache';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [cacheSize, setCacheSize] = useState<string>('');
  
  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const movieCollection = await getMovieCollection();
        const foundMovie = movieCollection.find(m => m.id === id);
        
        if (foundMovie) {
          setMovie(foundMovie);
        } else {
          // Movie not found, redirect to home
          toast.error('Movie not found');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error loading movie:', error);
        toast.error('Failed to load movie details');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    loadMovie();
    updateCacheSize();
  }, [id, navigate]);
  
  const updateCacheSize = async () => {
    try {
      const size = await getCacheSize();
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      setCacheSize(`${sizeMB} MB`);
    } catch (error) {
      console.error('Error getting cache size:', error);
    }
  };
  
  const handleClearCache = async () => {
    try {
      await clearImageCache();
      toast.success('Image cache cleared successfully');
      // Update the displayed cache size
      updateCacheSize();
      // Reload the current page to refresh images
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear image cache');
    }
  };
  
  // Set up realtime subscription for movie updates
  useEffect(() => {
    if (!id) return;
    
    // Make sure we're subscribed to the specific movie updates
    const channel = supabase
      .channel(`movie_updates_${id}`) // Use unique channel name with movie ID
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'movies',
          filter: `id=eq.${id}`
        },
        async (payload) => {
          console.log('Movie updated:', payload);
          // Refresh the movie data when an update occurs
          try {
            const movieCollection = await getMovieCollection();
            const updatedMovie = movieCollection.find(m => m.id === id);
            if (updatedMovie) {
              setMovie(updatedMovie);
              toast.success('Movie details updated');
            }
          } catch (error) {
            console.error('Error refreshing movie data:', error);
          }
        }
      )
      .subscribe();
    
    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  
  const handleMovieUpdate = async () => {
    if (!id) return;
    
    // Refresh movie data immediately after update
    try {
      const movieCollection = await getMovieCollection();
      const updatedMovie = movieCollection.find(m => m.id === id);
      if (updatedMovie) {
        setMovie(updatedMovie);
        toast.success('Movie details updated');
      }
    } catch (error) {
      console.error('Error refreshing movie data:', error);
      toast.error('Failed to refresh movie data');
    }
  };
  
  const handleMovieDelete = async () => {
    if (!id) return;
    
    try {
      await removeMovieFromCollection(id);
      toast.success('Movie removed from collection');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-28">
        {/* Cache management button */}
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-xs"
            onClick={handleClearCache}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear image cache {cacheSize && `(${cacheSize})`}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-200 opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : movie ? (
          <MovieDetail 
            movie={movie} 
            onUpdate={handleMovieUpdate} 
            onDelete={handleMovieDelete} 
          />
        ) : null}
      </main>
    </div>
  );
};

export default MoviePage;
