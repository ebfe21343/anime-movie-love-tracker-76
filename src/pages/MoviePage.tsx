
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieCollection } from '@/lib/api';
import { Movie } from '@/types/movie';
import Header from '@/components/Header';
import MovieDetail from '@/components/MovieDetail';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMovie = () => {
      setLoading(true);
      try {
        const movieCollection = getMovieCollection();
        const foundMovie = movieCollection.find(m => m.id === id);
        
        if (foundMovie) {
          setMovie(foundMovie);
        } else {
          // Movie not found, redirect to home
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error loading movie:', error);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadMovie();
    }
  }, [id, navigate]);
  
  const handleMovieUpdate = () => {
    // Refresh movie data
    const movieCollection = getMovieCollection();
    const updatedMovie = movieCollection.find(m => m.id === id);
    if (updatedMovie) {
      setMovie(updatedMovie);
    }
  };
  
  const handleMovieDelete = () => {
    navigate('/', { replace: true });
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
