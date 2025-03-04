
import { Season } from '@/types/movie';
import { ExistingSeasonItem } from './ExistingSeasonItem';
import { EmptySeasonsList } from './EmptySeasonsList';

interface SeasonListProps {
  seasons: Season[];
  updateSeason: (index: number, field: string, value: any) => void;
  updateSeasonRating: (index: number, person: 'lyan' | 'nastya', value: number) => void;
  updateSeasonComment: (index: number, person: 'lyan' | 'nastya', value: string) => void;
  updateSeasonCancelled: (index: number, cancelled: boolean) => void;
  confirmRemoveSeason: (index: number) => void;
}

export function SeasonList({
  seasons,
  updateSeason,
  updateSeasonRating,
  updateSeasonComment,
  updateSeasonCancelled,
  confirmRemoveSeason
}: SeasonListProps) {
  return (
    <>
      <h4 className="font-medium">Existing Seasons</h4>
      {seasons.length > 0 ? (
        <div className="space-y-4">
          {seasons.map((season, index) => (
            <ExistingSeasonItem
              key={season.id}
              season={season}
              index={index}
              updateSeason={updateSeason}
              updateSeasonRating={updateSeasonRating}
              updateSeasonComment={updateSeasonComment}
              updateSeasonCancelled={updateSeasonCancelled}
              confirmRemoveSeason={confirmRemoveSeason}
            />
          ))}
        </div>
      ) : (
        <EmptySeasonsList />
      )}
    </>
  );
}
