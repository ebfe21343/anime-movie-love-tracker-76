
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { LinkIcon, Clock } from 'lucide-react';
import { updateMovieInCollection } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Import our new components
import { MovieDetailHeader } from './movie-detail/MovieDetailHeader';
import { MovieInfo } from './movie-detail/MovieInfo';
import { MovieMetadata } from './movie-detail/MovieMetadata';
import { MovieSettings } from './movie-detail/MovieSettings';
import { RatingDisplay } from './movie-detail/RatingDisplay';
import { MovieCredits } from './movie-detail/MovieCredits';
import { CommentsSection } from './movie-detail/CommentsSection';
import { SeasonsDisplay } from './movie-detail/SeasonsDisplay';

interface MovieDetailProps {
  movie: Movie;
  onUpdate: () => void;
  onDelete: () => void;
}

const MovieDetail = ({ movie, onUpdate, onDelete }: MovieDetailProps) => {
  const [editMode, setEditMode] = useState(false);
  const [watchLink, setWatchLink] = useState(movie.watch_link);
  const [lyanRating, setLyanRating] = useState(movie.personal_ratings.lyan);
  const [nastyaRating, setNastyaRating] = useState(movie.personal_ratings.nastya);
  const [lyanComment, setLyanComment] = useState(movie.comments.lyan);
  const [nastyaComment, setNastyaComment] = useState(movie.comments.nastya);
  const [lyanWatched, setLyanWatched] = useState(movie.watched_by?.lyan !== false);
  const [nastyaWatched, setNastyaWatched] = useState(movie.watched_by?.nastya !== false);
  const [seasons, setSeasons] = useState(movie.seasons || []);
  const [cancelled, setCancelled] = useState(movie.cancelled || false);
  const [contentType, setContentType] = useState(movie.content_type || movie.type || 'movie');
  const [inQueue, setInQueue] = useState(movie.in_queue || false);
  
  const isSeries = contentType === 'series' || contentType === 'anime';
  
  useEffect(() => {
    setWatchLink(movie.watch_link);
    setLyanRating(movie.personal_ratings.lyan);
    setNastyaRating(movie.personal_ratings.nastya);
    setLyanComment(movie.comments.lyan);
    setNastyaComment(movie.comments.nastya);
    setLyanWatched(movie.watched_by?.lyan !== false);
    setNastyaWatched(movie.watched_by?.nastya !== false);
    setSeasons(movie.seasons || []);
    setCancelled(movie.cancelled || false);
    setContentType(movie.content_type || movie.type || 'movie');
    setInQueue(movie.in_queue || false);
  }, [movie]);
  
  const handleContentTypeChange = (type: string) => {
    console.log("Content type changed to:", type);
    setContentType(type);
  };
  
  const handleSaveChanges = async () => {
    try {
      console.log("Saving changes with seasons:", seasons);
      
      const updateData = {
        watch_link: watchLink,
        personal_ratings: {
          lyan: lyanRating,
          nastya: nastyaRating,
        },
        comments: {
          lyan: lyanComment,
          nastya: nastyaComment,
        },
        watched_by: {
          lyan: lyanWatched,
          nastya: nastyaWatched,
        },
        cancelled: cancelled,
        content_type: contentType,
        in_queue: inQueue
      };

      // Only include seasons if it's a series or anime
      if (isSeries) {
        Object.assign(updateData, { seasons: seasons });
      }
      
      await updateMovieInCollection(movie.id, updateData);
      
      toast.success('Movie details updated!');
      setEditMode(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update movie details');
      console.error(error);
    }
  };
  
  const handleMoveToCollection = async () => {
    try {
      await updateMovieInCollection(movie.id, {
        in_queue: false,
        watched_by: {
          lyan: true,
          nastya: true,
        },
        personal_ratings: {
          lyan: 5,
          nastya: 5,
        }
      });
      
      toast.success('Movie moved to your collection!');
      setInQueue(false);
      setLyanWatched(true);
      setNastyaWatched(true);
      setLyanRating(5);
      setNastyaRating(5);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to move movie to collection');
      console.error(error);
    }
  };
  
  const poster = movie.posters[0]?.url || '/placeholder.svg';
  
  return (
    <div className="w-full animate-fade-in">
      <MovieDetailHeader 
        movieTitle={movie.primary_title}
        editMode={editMode}
        onEditToggle={() => setEditMode(!editMode)}
        onSaveChanges={handleSaveChanges}
        onDelete={onDelete}
        inQueue={inQueue}
      />
      
      {inQueue && !editMode && (
        <div className="mb-6">
          <Card className="border-amber-300 bg-amber-50/50 shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <p className="text-amber-800 font-medium">This movie is in your queue (not watched yet)</p>
              </div>
              <Button 
                onClick={handleMoveToCollection}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Move to Collection
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <Card className="overflow-hidden border-none glass rounded-2xl">
            <MovieInfo 
              movie={movie}
              poster={poster}
              contentType={contentType}
              cancelled={cancelled}
              inQueue={inQueue}
            />
            
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-1 mb-4">
                {movie.genres.map(genre => (
                  <Badge 
                    key={genre} 
                    variant="secondary"
                    className="bg-lavender-500/80 text-white"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              
              <MovieMetadata movie={movie} />
              
              {editMode ? (
                <MovieSettings 
                  contentType={contentType}
                  cancelled={cancelled}
                  watchLink={watchLink}
                  inQueue={inQueue}
                  onContentTypeChange={handleContentTypeChange}
                  onCancelledChange={setCancelled}
                  onWatchLinkChange={setWatchLink}
                  onInQueueChange={setInQueue}
                />
              ) : movie.watch_link ? (
                <div className="pt-2">
                  <Button
                    variant="default"
                    className="w-full bg-sakura-500 hover:bg-sakura-600 btn-anime"
                    asChild
                  >
                    <a href={movie.watch_link} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Watch Now
                    </a>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
          
          {(!inQueue || editMode) && (
            <Card className="border-none glass rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-sakura-500" />
                  Personal Ratings
                </h3>
                
                <RatingDisplay 
                  lyanRating={lyanRating}
                  nastyaRating={nastyaRating}
                  lyanWatched={lyanWatched}
                  nastyaWatched={nastyaWatched}
                  editMode={editMode}
                  onLyanRatingChange={setLyanRating}
                  onNastyaRatingChange={setNastyaRating}
                  onLyanWatchedChange={setLyanWatched}
                  onNastyaWatchedChange={setNastyaWatched}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-full lg:w-2/3">
          <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-1">
                {movie.primary_title}
              </h1>
              
              {movie.original_title && movie.original_title !== movie.primary_title && (
                <p className="text-muted-foreground mb-4">
                  {movie.original_title}
                </p>
              )}
              
              <p className="mb-6 leading-relaxed">{movie.plot}</p>
              
              <MovieCredits movie={movie} />
            </CardContent>
          </Card>
          
          {isSeries && (!inQueue || editMode) && (
            <SeasonsDisplay 
              seasons={seasons}
              contentType={contentType}
              editMode={editMode}
              onSeasonsChange={setSeasons}
              onContentTypeChange={handleContentTypeChange}
              setEditMode={setEditMode}
            />
          )}
          
          {(editMode || (!inQueue && (lyanComment.trim() || nastyaComment.trim()))) && (
            <Card className="border-none glass rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Comments</h3>
                
                <CommentsSection 
                  lyanComment={lyanComment}
                  nastyaComment={nastyaComment}
                  lyanWatched={lyanWatched}
                  nastyaWatched={nastyaWatched}
                  editMode={editMode}
                  onLyanCommentChange={setLyanComment}
                  onNastyaCommentChange={setNastyaComment}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

export default MovieDetail;
