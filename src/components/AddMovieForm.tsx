
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MovieFormData, Season } from '@/types/movie';
import { addMovieToCollection } from '@/lib/api';
import FetchMovieSection from './add-movie-form/FetchMovieSection';
import FormContainer from './add-movie-form/FormContainer';
import MoviePreview from './add-movie-form/MoviePreview';
import SeasonForm from '@/components/SeasonForm';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const AddMovieForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [lyanRating, setLyanRating] = useState(5);
  const [nastyaRating, setNastyaRating] = useState(5);
  const [lyanWatched, setLyanWatched] = useState(true);
  const [nastyaWatched, setNastyaWatched] = useState(true);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [contentType, setContentType] = useState('movie');
  const [waiting, setWaiting] = useState(false);
  const [inQueue, setInQueue] = useState(false);

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
      watched_by: {
        lyan: true,
        nastya: true
      },
      watch_link: '',
      seasons: []
    }
  });

  useEffect(() => {
    setValue('personal_ratings.lyan', lyanRating);
    setValue('personal_ratings.nastya', nastyaRating);
    setValue('watched_by.lyan', lyanWatched);
    setValue('watched_by.nastya', nastyaWatched);
  }, [lyanRating, nastyaRating, lyanWatched, nastyaWatched, setValue]);

  useEffect(() => {
    setValue('seasons', seasons);
  }, [seasons, setValue]);

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
  };

  const onSubmit = async (data: MovieFormData) => {
    setIsLoading(true);
    try {
      const dataToSubmit = {
        ...data,
        content_type: contentType,
        seasons: contentType !== 'movie' ? seasons : undefined,
        in_queue: inQueue,
        waiting: waiting
      };
      
      await addMovieToCollection(data.id, {
        personal_ratings: data.personal_ratings,
        comments: data.comments,
        watched_by: data.watched_by,
        watch_link: data.watch_link,
        content_type: contentType,
        seasons: dataToSubmit.seasons,
        in_queue: inQueue,
        waiting: waiting
      });
      
      toast.success('Movie added to your collection!');
      reset();
      setPreview(null);
      setLyanRating(5);
      setNastyaRating(5);
      setLyanWatched(true);
      setNastyaWatched(true);
      setSeasons([]);
      setContentType('movie');
      setWaiting(false);
      setInQueue(false);
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
      <h2 className="text-2xl font-bold mb-6 text-center">Movie Details</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-2/5">
          <FetchMovieSection
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setPreview={setPreview}
            setContentType={setContentType}
            setValue={setValue}
            setSeasons={setSeasons}
            register={register}
            errors={errors}
          />
          
          {preview && (
            <div className="mt-4 mb-4 bg-white/50 rounded-lg p-4 border border-sakura-100">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="waiting"
                    checked={waiting}
                    onCheckedChange={(checked) => {
                      setWaiting(!!checked);
                      if (!!checked) setInQueue(false);
                    }}
                  />
                  <Label htmlFor="waiting" className="cursor-pointer font-medium">
                    Add to Waiting List
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-queue"
                    checked={inQueue}
                    onCheckedChange={(checked) => {
                      setInQueue(!!checked);
                      if (!!checked) setWaiting(false);
                    }}
                  />
                  <Label htmlFor="in-queue" className="cursor-pointer font-medium">
                    Add to Queue
                  </Label>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  Movies in your waiting list or queue won't require ratings or comments until you watch them
                </p>
              </div>
            </div>
          )}
          
          <FormContainer
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            lyanRating={lyanRating}
            nastyaRating={nastyaRating}
            lyanWatched={lyanWatched}
            nastyaWatched={nastyaWatched}
            setLyanRating={setLyanRating}
            setNastyaRating={setNastyaRating}
            setLyanWatched={setLyanWatched}
            setNastyaWatched={setNastyaWatched}
            isLoading={isLoading}
            preview={preview}
            contentType={contentType}
            inQueue={inQueue}
            waiting={waiting}
          />
        </div>
        
        <div className="w-full md:w-3/5">
          <MoviePreview 
            preview={preview} 
            contentType={contentType} 
          />
          
          {preview && (
            <div className="pt-4 pb-2">
              <SeasonForm 
                seasons={seasons} 
                onSeasonsChange={setSeasons} 
                contentType={contentType}
                onContentTypeChange={handleContentTypeChange}
                waiting={waiting || inQueue}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMovieForm;
