
import { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { MovieCredits } from './MovieCredits';
import { SeasonsDisplay } from './SeasonsDisplay';
import { CommentsSection } from './CommentsSection';
import { Season } from '@/types/movie';

interface MainContentProps {
  movie: Movie;
  editMode: boolean;
  lyanComment: string;
  nastyaComment: string;
  lyanWatched: boolean;
  nastyaWatched: boolean;
  waiting: boolean;
  inQueue: boolean;
  seasons: Season[];
  contentType: string;
  setEditMode: (editMode: boolean) => void;
  onLyanCommentChange: (comment: string) => void;
  onNastyaCommentChange: (comment: string) => void;
  onSeasonsChange: (seasons: Season[]) => void;
  onContentTypeChange: (type: string) => void;
}

export const MainContent = ({
  movie,
  editMode,
  lyanComment,
  nastyaComment,
  lyanWatched,
  nastyaWatched,
  waiting,
  inQueue,
  seasons,
  contentType,
  setEditMode,
  onLyanCommentChange,
  onNastyaCommentChange,
  onSeasonsChange,
  onContentTypeChange
}: MainContentProps) => {
  const isSeries = contentType === 'series' || contentType === 'anime';

  return (
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
      
      {isSeries && (
        <SeasonsDisplay 
          seasons={seasons}
          contentType={contentType}
          editMode={editMode}
          waiting={waiting}
          inQueue={inQueue}
          onSeasonsChange={onSeasonsChange}
          onContentTypeChange={onContentTypeChange}
          setEditMode={setEditMode}
        />
      )}
      
      {(editMode || (!waiting && !inQueue && (lyanComment.trim() || nastyaComment.trim()))) && (
        <Card className="border-none glass rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">Comments</h3>
            
            <CommentsSection 
              lyanComment={lyanComment}
              nastyaComment={nastyaComment}
              lyanWatched={lyanWatched}
              nastyaWatched={nastyaWatched}
              editMode={editMode}
              waiting={waiting}
              inQueue={inQueue}
              onLyanCommentChange={onLyanCommentChange}
              onNastyaCommentChange={onNastyaCommentChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
