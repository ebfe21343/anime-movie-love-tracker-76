
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fetchMovieById } from '@/lib/api';

interface FetchMovieSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setPreview: (preview: any) => void;
  setIsSeries: (isSeries: boolean) => void;
  setContentType: (contentType: string) => void;
  setValue: (field: string, value: any) => void;
  setSeasons: (seasons: any[]) => void;
  register: any;
  errors: any;
}

const FetchMovieSection = ({
  isLoading,
  setIsLoading,
  setPreview,
  setIsSeries,
  setContentType,
  setValue,
  setSeasons,
  register,
  errors
}: FetchMovieSectionProps) => {
  const handleFetchPreview = async () => {
    const id = document.getElementById('imdbId') as HTMLInputElement;
    if (!id.value || id.value.trim() === '') {
      toast.error('Please enter an IMDb ID');
      return;
    }

    setIsLoading(true);
    try {
      const movieData = await fetchMovieById(id.value);
      setPreview(movieData);
      setValue('id', id.value);
      
      const isTvSeries = movieData.type === 'tvSeries' || movieData.type === 'tvMiniSeries';
      setIsSeries(isTvSeries);
      const detectedType = isTvSeries ? 'series' : 'movie';
      setContentType(detectedType);
      
      if (isTvSeries && movieData.end_year === null) {
        setSeasons([]);
      }
    } catch (error) {
      console.error('Error fetching movie preview:', error);
      toast.error('Could not find movie with that ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <Label htmlFor="imdbId">IMDb ID</Label>
      <div className="flex mt-1.5">
        <Input
          id="imdbId"
          placeholder="e.g. tt0944947"
          className="rounded-r-none"
          {...register('id', { required: true })}
        />
        <Button 
          onClick={handleFetchPreview} 
          disabled={isLoading}
          className="rounded-l-none bg-sakura-500 hover:bg-sakura-600"
        >
          <Search className="h-4 w-4 mr-2" />
          Fetch
        </Button>
      </div>
      {errors.id && (
        <span className="text-destructive text-sm mt-1">IMDb ID is required</span>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Example: tt0944947 (for Game of Thrones)
      </p>
    </div>
  );
};

export default FetchMovieSection;
