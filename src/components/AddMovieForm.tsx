
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Search, Film, Star, Link as LinkIcon, Tv } from 'lucide-react';
import { MovieFormData, Season } from '@/types/movie';
import { addMovieToCollection, fetchMovieById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SeasonForm from '@/components/SeasonForm';

const AddMovieForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [lyanRating, setLyanRating] = useState(5);
  const [nastyaRating, setNastyaRating] = useState(5);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isSeries, setIsSeries] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<MovieFormData>({
    defaultValues: {
      id: '',
      personal_ratings: {
        lyan: 5,
        nastya: 5
      },
      comments: {
        lyan: '',
        nastya: ''
      },
      watch_link: '',
      seasons: []
    }
  });

  // Update form values when ratings change
  useEffect(() => {
    setValue('personal_ratings.lyan', lyanRating);
    setValue('personal_ratings.nastya', nastyaRating);
  }, [lyanRating, nastyaRating, setValue]);

  // Update seasons in form
  useEffect(() => {
    setValue('seasons', seasons);
  }, [seasons, setValue]);

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
      
      // Detect if it's a series
      const isTvSeries = movieData.type === 'tvSeries' || movieData.type === 'tvMiniSeries';
      setIsSeries(isTvSeries);
      
      // If it's a series and end_year is null, it might be ongoing
      if (isTvSeries && movieData.end_year === null) {
        setSeasons([]); // Reset seasons when fetching a new show
      }
    } catch (error) {
      console.error('Error fetching movie preview:', error);
      toast.error('Could not find movie with that ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MovieFormData) => {
    setIsLoading(true);
    try {
      // Only include seasons if it's a series
      const dataToSubmit = {
        ...data,
        seasons: isSeries ? seasons : undefined
      };
      
      await addMovieToCollection(data.id, {
        personal_ratings: data.personal_ratings,
        comments: data.comments,
        watch_link: data.watch_link,
        seasons: dataToSubmit.seasons
      });
      
      toast.success('Movie added to your collection!');
      reset();
      setPreview(null);
      setLyanRating(5);
      setNastyaRating(5);
      setSeasons([]);
      navigate('/');
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast.error(error.message || 'Failed to add movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 animate-fade-in">
      <h2 className="text-2xl font-bold mb-1 text-center">Add Movie to Collection</h2>
      <p className="text-center text-muted-foreground mb-6">
        Enter an IMDb ID to fetch movie details and add it to your collection
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-2/5">
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
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Personal ratings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Your Ratings</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="lyan-rating">Lyan's Rating</Label>
                    <Badge variant="outline" className="font-bold">
                      {lyanRating}/10
                    </Badge>
                  </div>
                  <Slider
                    id="lyan-rating"
                    defaultValue={[5]}
                    max={10}
                    step={1}
                    value={[lyanRating]}
                    onValueChange={(values) => setLyanRating(values[0])}
                    className="py-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="nastya-rating">Nastya's Rating</Label>
                    <Badge variant="outline" className="font-bold">
                      {nastyaRating}/10
                    </Badge>
                  </div>
                  <Slider
                    id="nastya-rating"
                    defaultValue={[5]}
                    max={10}
                    step={1}
                    value={[nastyaRating]}
                    onValueChange={(values) => setNastyaRating(values[0])}
                    className="py-2"
                  />
                </div>
              </div>
              
              {/* Watch Link */}
              <div>
                <Label htmlFor="watchLink" className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Streaming Link
                </Label>
                <Input
                  id="watchLink"
                  placeholder="https://..."
                  className="mt-1.5"
                  {...register('watch_link')}
                />
              </div>
              
              {/* Comments */}
              <div>
                <h3 className="text-lg font-medium mb-4">Your Comments</h3>
                
                <div className="mb-4">
                  <Label htmlFor="lyan-comment">Lyan's Comment</Label>
                  <Textarea
                    id="lyan-comment"
                    placeholder="What did you think of this movie?"
                    className="mt-1.5 resize-none"
                    rows={3}
                    {...register('comments.lyan')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nastya-comment">Nastya's Comment</Label>
                  <Textarea
                    id="nastya-comment"
                    placeholder="What did Nastya think of this movie?"
                    className="mt-1.5 resize-none"
                    rows={3}
                    {...register('comments.nastya')}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-sakura-500 hover:bg-sakura-600 btn-anime"
                  disabled={isLoading || !preview}
                >
                  {isSeries ? (
                    <Tv className="h-4 w-4 mr-2" />
                  ) : (
                    <Film className="h-4 w-4 mr-2" />
                  )}
                  Add {isSeries ? 'Series' : 'Movie'} to Collection
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="w-full md:w-3/5">
          {preview ? (
            <div className="animate-scale-in">
              <h3 className="text-lg font-medium mb-4">
                {isSeries ? 'Series' : 'Movie'} Preview
              </h3>
              <Card className="overflow-hidden border-none glass">
                <div className="flex flex-col lg:flex-row">
                  {preview.posters && preview.posters[0] && (
                    <div className="w-full lg:w-1/3 aspect-[2/3]">
                      <img 
                        src={preview.posters[0].url} 
                        alt={preview.primary_title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardContent className="flex-1 p-5">
                    <div className="mb-2 flex justify-between items-start">
                      <h2 className="text-xl font-bold">{preview.primary_title}</h2>
                      {preview.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-bold">
                            {preview.rating.aggregate_rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({preview.rating.votes_count.toLocaleString()} votes)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Badge 
                        className={isSeries ? 'bg-lavender-500' : 'bg-sakura-500'} 
                        variant="default"
                      >
                        {isSeries ? (
                          <div className="flex items-center">
                            <Tv className="h-3.5 w-3.5 mr-1" />
                            Series
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Film className="h-3.5 w-3.5 mr-1" />
                            Movie
                          </div>
                        )}
                      </Badge>
                      <span>{preview.start_year}{preview.end_year ? ` - ${preview.end_year}` : ''}</span>
                      {preview.runtime_minutes && (
                        <span>
                          {Math.floor(preview.runtime_minutes / 60)}h {preview.runtime_minutes % 60}m
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preview.genres?.map((genre: string) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-3">{preview.plot}</p>
                    
                    <div className="text-sm">
                      {preview.directors && preview.directors.length > 0 && (
                        <div className="mb-2">
                          <span className="font-medium">Director: </span>
                          {preview.directors.slice(0, 2).map((d: any, idx: number) => (
                            <span key={d.name.id}>
                              {d.name.display_name}
                              {idx < Math.min(preview.directors.length, 2) - 1 ? ', ' : ''}
                            </span>
                          ))}
                          {preview.directors.length > 2 && ', ...'}
                        </div>
                      )}
                      
                      {preview.spoken_languages && preview.spoken_languages.length > 0 && (
                        <div className="mb-2">
                          <span className="font-medium">Language: </span>
                          {preview.spoken_languages.map((l: any, idx: number) => (
                            <span key={l.code}>
                              {l.name}
                              {idx < preview.spoken_languages.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {preview.origin_countries && preview.origin_countries.length > 0 && (
                        <div>
                          <span className="font-medium">Country: </span>
                          {preview.origin_countries.map((c: any, idx: number) => (
                            <span key={c.code}>
                              {c.name}
                              {idx < preview.origin_countries.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
              
              {/* Season form (only visible if it's a series) */}
              {preview && isSeries && (
                <div className="pt-4 pb-2">
                  <SeasonForm 
                    seasons={seasons} 
                    onSeasonsChange={setSeasons} 
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-10 px-4 text-center bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Movie Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Enter an IMDb ID and click "Fetch" to preview movie details before adding it to your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMovieForm;
