import { useEffect, useState } from 'react';
import { getMovieCollection } from '@/lib/api';
import { Movie } from '@/types/movie';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Clock } from 'lucide-react';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const movieCollection = await getMovieCollection();
        setMovies(movieCollection);
      } catch (error) {
        console.error('Error loading movies:', error);
        toast.error('Failed to load your movie collection');
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, []);

  const collectionMovies = movies.filter(movie => !movie.in_queue && !movie.waiting);
  const waitingMovies = movies.filter(movie => movie.waiting);
  const queueMovies = movies.filter(movie => movie.in_queue);

  const collectionCount = collectionMovies.length;
  const waitingCount = waitingMovies.length;
  const queueCount = queueMovies.length;

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-28">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sakura-700 mb-2">
            Our Movie Collection
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-200 opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="collection" className="w-full">
            <div className="flex flex-row gap-4 mb-6 items-center">
              <TabsList className="h-10">
                <TabsTrigger value="collection" className="flex items-center gap-2">
                  Collection
                  <span className="bg-lavender-100 text-lavender-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {collectionCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="waiting" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  Waiting
                  <span className="bg-lavender-100 text-lavender-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {waitingCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="queue" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Queue
                  <span className="bg-lavender-100 text-lavender-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {queueCount}
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1">
                <MovieGrid.SearchAndFilterBar movies={movies} />
              </div>
            </div>
            
            <TabsContent value="collection" className="focus-visible:outline-none focus-visible:ring-0">
              <MovieGrid movies={collectionMovies} showSearchBar={false} />
            </TabsContent>
            
            <TabsContent value="waiting" className="focus-visible:outline-none focus-visible:ring-0">
              {waitingMovies.length > 0 ? (
                <MovieGrid movies={waitingMovies} showSearchBar={false} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <ListTodo className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your waiting list is empty</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Add movies to your waiting list by checking the "Waiting" option when adding a new movie.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="queue" className="focus-visible:outline-none focus-visible:ring-0">
              {queueMovies.length > 0 ? (
                <MovieGrid movies={queueMovies} showSearchBar={false} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your queue is empty</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Add movies to your queue by checking the "Queue" option when adding a new movie.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
