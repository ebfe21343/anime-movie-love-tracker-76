
import { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieInfo } from './MovieInfo';
import { MovieMetadata } from './MovieMetadata';
import { MovieSettings } from './MovieSettings';
import { RatingDisplay } from './RatingDisplay';
import { Heart } from 'lucide-react';

interface SidebarProps {
  movie: Movie;
  editMode: boolean;
  poster: string;
  contentType: string;
  cancelled: boolean;
  watchLink: string;
  waiting: boolean;
  inQueue: boolean;
  lyanRating: number;
  nastyaRating: number;
  lyanWatched: boolean;
  nastyaWatched: boolean;
  onContentTypeChange: (type: string) => void;
  onCancelledChange: (cancelled: boolean) => void;
  onWatchLinkChange: (link: string) => void;
  onWaitingChange: (waiting: boolean) => void;
  onInQueueChange: (inQueue: boolean) => void;
  onLyanRatingChange: (rating: number) => void;
  onNastyaRatingChange: (rating: number) => void;
  onLyanWatchedChange: (watched: boolean) => void;
  onNastyaWatchedChange: (watched: boolean) => void;
}

export const Sidebar = ({
  movie,
  editMode,
  poster,
  contentType,
  cancelled,
  watchLink,
  waiting,
  inQueue,
  lyanRating,
  nastyaRating,
  lyanWatched,
  nastyaWatched,
  onContentTypeChange,
  onCancelledChange,
  onWatchLinkChange,
  onWaitingChange,
  onInQueueChange,
  onLyanRatingChange,
  onNastyaRatingChange,
  onLyanWatchedChange,
  onNastyaWatchedChange
}: SidebarProps) => {
  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-4">
      <Card className="overflow-hidden border-none glass rounded-2xl">
        <MovieInfo 
          movie={movie}
          poster={poster}
          contentType={contentType}
          cancelled={cancelled}
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
          
          {editMode && (
            <MovieSettings 
              contentType={contentType}
              cancelled={cancelled}
              watchLink={watchLink}
              waiting={waiting}
              inQueue={inQueue}
              onContentTypeChange={onContentTypeChange}
              onCancelledChange={onCancelledChange}
              onWatchLinkChange={onWatchLinkChange}
              onWaitingChange={onWaitingChange}
              onInQueueChange={onInQueueChange}
            />
          )}
          
          {!editMode && movie.watch_link && (
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
          )}
        </CardContent>
      </Card>
      
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
            waiting={waiting}
            inQueue={inQueue}
            onLyanRatingChange={onLyanRatingChange}
            onNastyaRatingChange={onNastyaRatingChange}
            onLyanWatchedChange={onLyanWatchedChange}
            onNastyaWatchedChange={onNastyaWatchedChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

import { Badge } from '@/components/ui/badge';
