
import { useEffect, useState } from 'react';
import { getMovieCollection } from '@/lib/api';
import { Movie } from '@/types/movie';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load movies from local storage
    const loadMovies = () => {
      setLoading(true);
      try {
        const movieCollection = getMovieCollection();
        setMovies(movieCollection);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-28">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sakura-700 mb-2">
            Movie Collection
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your favorite movies, rate them, and add personal comments.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-200 opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </main>
    </div>
  );
};

export default Index;
