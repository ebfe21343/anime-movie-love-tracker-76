
import { Movie } from '@/types/movie';
import { MovieDetailHeader } from './movie-detail/MovieDetailHeader';
import { Sidebar } from './movie-detail/Sidebar';
import { MainContent } from './movie-detail/MainContent';
import { useMovieDetail } from '@/hooks/useMovieDetail';

interface MovieDetailProps {
  movie: Movie;
  onUpdate: () => void;
  onDelete: () => void;
}

const MovieDetail = ({ movie, onUpdate, onDelete }: MovieDetailProps) => {
  const {
    editMode,
    setEditMode,
    watchLink,
    setWatchLink,
    lyanRating,
    setLyanRating,
    nastyaRating,
    setNastyaRating,
    lyanComment,
    setLyanComment,
    nastyaComment,
    setNastyaComment,
    lyanWatched,
    setLyanWatched,
    nastyaWatched,
    setNastyaWatched,
    seasons,
    setSeasons,
    cancelled,
    setCancelled,
    contentType,
    waiting,
    setWaiting,
    inQueue,
    setInQueue,
    handleContentTypeChange,
    handleSaveChanges
  } = useMovieDetail(movie, onUpdate);
  
  const poster = movie.posters[0]?.url || '/placeholder.svg';
  
  return (
    <div className="w-full animate-fade-in">
      <MovieDetailHeader 
        movieTitle={movie.primary_title}
        editMode={editMode}
        onEditToggle={() => setEditMode(!editMode)}
        onSaveChanges={handleSaveChanges}
        onDelete={onDelete}
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar 
          movie={movie}
          editMode={editMode}
          poster={poster}
          contentType={contentType}
          cancelled={cancelled}
          watchLink={watchLink}
          waiting={waiting}
          inQueue={inQueue}
          lyanRating={lyanRating}
          nastyaRating={nastyaRating}
          lyanWatched={lyanWatched}
          nastyaWatched={nastyaWatched}
          onContentTypeChange={handleContentTypeChange}
          onCancelledChange={setCancelled}
          onWatchLinkChange={setWatchLink}
          onWaitingChange={setWaiting}
          onInQueueChange={setInQueue}
          onLyanRatingChange={setLyanRating}
          onNastyaRatingChange={setNastyaRating}
          onLyanWatchedChange={setLyanWatched}
          onNastyaWatchedChange={setNastyaWatched}
        />
        
        <MainContent 
          movie={movie}
          editMode={editMode}
          lyanComment={lyanComment}
          nastyaComment={nastyaComment}
          lyanWatched={lyanWatched}
          nastyaWatched={nastyaWatched}
          waiting={waiting}
          inQueue={inQueue}
          seasons={seasons}
          contentType={contentType}
          setEditMode={setEditMode}
          onLyanCommentChange={setLyanComment}
          onNastyaCommentChange={setNastyaComment}
          onSeasonsChange={setSeasons}
          onContentTypeChange={handleContentTypeChange}
        />
      </div>
    </div>
  );
};

export default MovieDetail;
