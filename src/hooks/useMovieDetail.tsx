
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { updateMovieInCollection } from '@/lib/api';
import { toast } from 'sonner';

export function useMovieDetail(movie: Movie, onUpdate: () => void) {
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
  const [waiting, setWaiting] = useState(movie.waiting || false);
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
    setWaiting(movie.waiting || false);
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
        waiting: waiting,
        in_queue: inQueue,
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

  return {
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
    setContentType,
    waiting,
    setWaiting,
    inQueue,
    setInQueue,
    isSeries,
    handleContentTypeChange,
    handleSaveChanges
  };
}
