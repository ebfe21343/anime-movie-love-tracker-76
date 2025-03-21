
// We cannot modify SeasonForm.tsx directly as it's in read-only files
// Instead we'll create a wrapper to pass the waiting parameter
// This is a minimal change to make it work as requested

import { useEffect } from 'react';
import { Season } from '@/types/movie';
import { SeasonsFormManager } from './season-form/SeasonsFormManager';

interface SeasonFormProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
  waiting?: boolean;
}

const SeasonForm = ({ 
  seasons, 
  onSeasonsChange, 
  contentType, 
  onContentTypeChange,
  waiting = false 
}: SeasonFormProps) => {
  // When in waiting mode, modify seasons to not have ratings/comments
  useEffect(() => {
    if (waiting && seasons.length > 0) {
      // Create a copy of seasons but clear ratings/comments for waiting mode
      const updatedSeasons = seasons.map(season => ({
        ...season,
        personal_ratings: { lyan: 0, nastya: 0 },
        comments: { lyan: '', nastya: '' },
        watched_by: { lyan: false, nastya: false }
      }));
      
      if (JSON.stringify(seasons) !== JSON.stringify(updatedSeasons)) {
        onSeasonsChange(updatedSeasons);
      }
    }
  }, [waiting, seasons, onSeasonsChange]);

  // Original component
  return (
    <SeasonsFormManager
      seasons={seasons}
      onSeasonsChange={onSeasonsChange}
      contentType={contentType}
      onContentTypeChange={onContentTypeChange}
    />
  );
};

export default SeasonForm;
