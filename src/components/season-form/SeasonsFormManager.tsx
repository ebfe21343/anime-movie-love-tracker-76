
import { useState } from 'react';
import { Season } from '@/types/movie';
import SeasonForm from '../SeasonForm';

interface SeasonsFormManagerProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
  waiting?: boolean;
}

export function SeasonsFormManager({
  seasons,
  onSeasonsChange,
  contentType,
  onContentTypeChange,
  waiting = false
}: SeasonsFormManagerProps) {
  const [editMode, setEditMode] = useState(false);
  
  return (
    <>
      {editMode ? (
        <SeasonForm
          seasons={seasons}
          onSeasonsChange={onSeasonsChange}
          contentType={contentType}
          onContentTypeChange={onContentTypeChange}
          waiting={waiting}
        />
      ) : (
        <div>
          {/* This component will be implemented in a separate PR */}
        </div>
      )}
    </>
  );
}
