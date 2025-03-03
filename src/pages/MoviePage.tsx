
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieCollection, removeMovieFromCollection } from '@/lib/api';
import { Movie } from '@/types/movie';
import Header from '@/components/Header';
import MovieDetail from '@/components/MovieDetail';
import { toast } from 'sonner';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  
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
  }, [id, navigate]);
  
  const handleMovieUpdate = async () => {
    if (!id) return;
    
    // Refresh movie data
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
