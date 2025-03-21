
import { useState } from 'react';
import { Season } from '@/types/movie';
import SeasonForm from '../SeasonForm';

interface SeasonsFormManagerProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
}

export function SeasonsFormManager({
  seasons,
  onSeasonsChange,
  contentType,
  onContentTypeChange
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
        />
      ) : (
        <div>
          {/* This component will be implemented in a separate PR */}
        </div>
      )}
    </>
  );
}
