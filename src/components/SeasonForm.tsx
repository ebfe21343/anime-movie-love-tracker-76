
import { useState } from 'react';
import { Season } from '@/types/movie';
import { SeasonHeader } from './season-form/SeasonHeader';
import { NewSeasonForm } from './season-form/NewSeasonForm';
import { SeasonList } from './season-form/SeasonList';
import { DeleteSeasonDialog } from './season-form/DeleteSeasonDialog';

interface SeasonFormProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
  contentType?: string;
  onContentTypeChange?: (type: string) => void;
}

const SeasonForm = ({ 
  seasons, 
  onSeasonsChange, 
  contentType = 'movie',
  onContentTypeChange 
}: SeasonFormProps) => {
  const [newSeason, setNewSeason] = useState<Omit<Season, 'id'>>({
    season_number: (seasons.length > 0 ? Math.max(...seasons.map(s => s.season_number)) : 0) + 1,
    title: '',
    year: new Date().getFullYear(),
    personal_ratings: { lyan: 5, nastya: 5 },
    comments: { lyan: '', nastya: '' },
    cancelled: false
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<number | null>(null);
  
  // Remove the early return - we always want to render the component regardless of contentType
  // We just conditionally render the season management UI

  const addSeason = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const id = `season_${Date.now()}`;
    
    onSeasonsChange([
      ...seasons,
      {
        ...newSeason,
        id
      }
    ]);
    
    setNewSeason({
      season_number: newSeason.season_number + 1,
      title: '',
      year: new Date().getFullYear(),
      personal_ratings: { lyan: 5, nastya: 5 },
      comments: { lyan: '', nastya: '' },
      cancelled: false
    });
  };
  
  const confirmRemoveSeason = (index: number) => {
    setSeasonToDelete(index);
    setIsDeleteDialogOpen(true);
  };
  
  const removeSeason = () => {
    if (seasonToDelete !== null) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(seasonToDelete, 1);
      onSeasonsChange(updatedSeasons);
      setIsDeleteDialogOpen(false);
      setSeasonToDelete(null);
    }
  };
  
  const updateSeasonRating = (index: number, person: 'lyan' | 'nastya', value: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index].personal_ratings[person] = value;
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeasonComment = (index: number, person: 'lyan' | 'nastya', value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index].comments[person] = value;
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeasonCancelled = (index: number, cancelled: boolean) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      cancelled
    };
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeason = (index: number, field: string, value: any) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      [field]: value
    };
    onSeasonsChange(updatedSeasons);
  };
  
  // Always render the SeasonHeader with content type selector
  return (
    <div className="space-y-6">
      <SeasonHeader 
        title="Manage Seasons" 
        contentType={contentType} 
        onContentTypeChange={onContentTypeChange} 
      />
      
      {/* Only render season management UI when contentType isn't 'movie' */}
      {contentType !== 'movie' ? (
        <>
          <NewSeasonForm 
            newSeason={newSeason}
            setNewSeason={setNewSeason}
            addSeason={addSeason}
          />
          
          <SeasonList 
            seasons={seasons}
            updateSeason={updateSeason}
            updateSeasonRating={updateSeasonRating}
            updateSeasonComment={updateSeasonComment}
            updateSeasonCancelled={updateSeasonCancelled}
            confirmRemoveSeason={confirmRemoveSeason}
            contentType={contentType}
          />
          
          <DeleteSeasonDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={removeSeason}
          />
        </>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Season management is only available for series, cartoons, and anime.
        </p>
      )}
    </div>
  );
};

export default SeasonForm;
