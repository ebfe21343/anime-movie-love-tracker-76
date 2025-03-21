import { useState } from 'react';
import { Season } from '@/types/movie';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false);
  const [newSeason, setNewSeason] = useState<Omit<Season, 'id'>>({
    season_number: (seasons.length > 0 ? Math.max(...seasons.map(s => s.season_number)) : 0) + 1,
    title: '',
    year: new Date().getFullYear(),
    personal_ratings: { lyan: 5, nastya: 5 },
    comments: { lyan: '', nastya: '' },
    watched_by: { lyan: true, nastya: true },
    cancelled: false
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<number | null>(null);
  
  const supportsSeasons = contentType === 'series' || contentType === 'anime' || contentType === 'cartoon';

  const addSeason = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Adding new season");
    const id = `season_${Date.now()}`;
    
    const updatedSeasons = [
      ...seasons,
      {
        ...newSeason,
        id
      }
    ];
    
    console.log("Updated seasons after add:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
    
    setNewSeason({
      season_number: newSeason.season_number + 1,
      title: '',
      year: new Date().getFullYear(),
      personal_ratings: { lyan: 5, nastya: 5 },
      comments: { lyan: '', nastya: '' },
      watched_by: { lyan: true, nastya: true },
      cancelled: false
    });
    
    setShowNewSeasonForm(false);
  };
  
  const confirmRemoveSeason = (index: number) => {
    setSeasonToDelete(index);
    setIsDeleteDialogOpen(true);
  };
  
  const removeSeason = () => {
    if (seasonToDelete !== null) {
      const updatedSeasons = [...seasons];
      updatedSeasons.splice(seasonToDelete, 1);
      console.log("Updated seasons after remove:", updatedSeasons);
      onSeasonsChange(updatedSeasons);
      setIsDeleteDialogOpen(false);
      setSeasonToDelete(null);
    }
  };
  
  const updateSeasonRating = (index: number, person: 'lyan' | 'nastya', value: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index].personal_ratings[person] = value;
    console.log("Updated seasons after rating change:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeasonComment = (index: number, person: 'lyan' | 'nastya', value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index].comments[person] = value;
    console.log("Updated seasons after comment change:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
  };

  const updateSeasonWatched = (index: number, person: 'lyan' | 'nastya', watched: boolean) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index].watched_by[person] = watched;
    console.log("Updated seasons after watched change:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeasonCancelled = (index: number, cancelled: boolean) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      cancelled
    };
    console.log("Updated seasons after cancelled change:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
  };
  
  const updateSeason = (index: number, field: string, value: any) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      [field]: value
    };
    console.log("Updated seasons after field change:", updatedSeasons);
    onSeasonsChange(updatedSeasons);
  };
  
  return (
    <div className="space-y-6">
      <SeasonHeader 
        contentType={contentType}
        seasonsCount={seasons.length}
      />
      
      {supportsSeasons ? (
        <>
          {!showNewSeasonForm ? (
            <Button
              onClick={() => setShowNewSeasonForm(true)}
              className="w-full bg-lavender-500 hover:bg-lavender-600 mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Season
            </Button>
          ) : (
            <NewSeasonForm 
              newSeason={newSeason}
              setNewSeason={setNewSeason}
              addSeason={addSeason}
              onCancel={() => setShowNewSeasonForm(false)}
            />
          )}
          
          <SeasonList 
            seasons={seasons}
            contentType={contentType}
          />
        </>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Season management is only available for series, anime, and cartoons.
        </p>
      )}
      
      <DeleteSeasonDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={removeSeason}
      />
    </div>
  );
};

export default SeasonForm;
