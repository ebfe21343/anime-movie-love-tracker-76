
import { Minus } from 'lucide-react';
import { Season } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RatingCommentSection } from './RatingCommentSection';
import { Checkbox } from '@/components/ui/checkbox';

interface ExistingSeasonItemProps {
  season: Season;
  index: number;
  updateSeason: (index: number, field: string, value: any) => void;
  updateSeasonRating: (index: number, person: 'lyan' | 'nastya', value: number) => void;
  updateSeasonComment: (index: number, person: 'lyan' | 'nastya', value: string) => void;
  updateSeasonWatched: (index: number, person: 'lyan' | 'nastya', watched: boolean) => void;
  updateSeasonCancelled: (index: number, cancelled: boolean) => void;
  confirmRemoveSeason: (index: number) => void;
}

export function ExistingSeasonItem({
  season,
  index,
  updateSeason,
  updateSeasonRating,
  updateSeasonComment,
  updateSeasonWatched,
  updateSeasonCancelled,
  confirmRemoveSeason
}: ExistingSeasonItemProps) {
  return (
    <Card key={season.id} className="bg-white/40 relative">
      <CardContent className="p-4">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10"
            onClick={() => confirmRemoveSeason(index)}
            type="button"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor={`season_number_${index}`}>Season Number</Label>
            <Input
              id={`season_number_${index}`}
              type="number"
              value={season.season_number}
              onChange={(e) => {
                updateSeason(
                  index, 
                  'season_number', 
                  parseInt(e.target.value) || 1
                );
              }}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`season_title_${index}`}>Season Title (optional)</Label>
            <Input
              id={`season_title_${index}`}
              value={season.title}
              onChange={(e) => {
                updateSeason(index, 'title', e.target.value);
              }}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`cancelled_${index}`}
              checked={season.cancelled}
              onCheckedChange={(checked) => updateSeasonCancelled(index, checked === true)}
            />
            <Label htmlFor={`cancelled_${index}`} className="text-sm cursor-pointer">
              Mark as Cancelled
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id={`nastya-watched-${index}`}
                checked={season.watched_by?.nastya !== false}
                onCheckedChange={(checked) => updateSeasonWatched(index, 'nastya', checked === true)}
              />
              <Label htmlFor={`nastya-watched-${index}`} className="text-sm cursor-pointer">
                Nastya watched this season
              </Label>
            </div>
            
            <RatingCommentSection
              person="nastya"
              rating={season.personal_ratings.nastya}
              comment={season.comments.nastya}
              watched={season.watched_by?.nastya !== false}
              onRatingChange={(value) => updateSeasonRating(index, 'nastya', value)}
              onCommentChange={(value) => updateSeasonComment(index, 'nastya', value)}
              id={index.toString()}
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id={`lyan-watched-${index}`}
                checked={season.watched_by?.lyan !== false}
                onCheckedChange={(checked) => updateSeasonWatched(index, 'lyan', checked === true)}
              />
              <Label htmlFor={`lyan-watched-${index}`} className="text-sm cursor-pointer">
                Lyan watched this season
              </Label>
            </div>
            
            <RatingCommentSection
              person="lyan"
              rating={season.personal_ratings.lyan}
              comment={season.comments.lyan}
              watched={season.watched_by?.lyan !== false}
              onRatingChange={(value) => updateSeasonRating(index, 'lyan', value)}
              onCommentChange={(value) => updateSeasonComment(index, 'lyan', value)}
              id={index.toString()}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
