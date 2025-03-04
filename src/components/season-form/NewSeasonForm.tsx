
import { Plus } from 'lucide-react';
import { Season } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RatingCommentSection } from './RatingCommentSection';

interface NewSeasonFormProps {
  newSeason: Omit<Season, 'id'>;
  setNewSeason: (season: Omit<Season, 'id'>) => void;
  addSeason: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function NewSeasonForm({ 
  newSeason, 
  setNewSeason, 
  addSeason 
}: NewSeasonFormProps) {
  return (
    <Card className="bg-white/40">
      <CardContent className="p-4">
        <h4 className="font-medium mb-4">Add New Season</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="season_number">Season Number</Label>
            <Input
              id="season_number"
              type="number"
              value={newSeason.season_number}
              onChange={(e) => setNewSeason({
                ...newSeason,
                season_number: parseInt(e.target.value) || 1
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="season_title">Season Title (optional)</Label>
            <Input
              id="season_title"
              value={newSeason.title}
              onChange={(e) => setNewSeason({
                ...newSeason,
                title: e.target.value
              })}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <RatingCommentSection
            person="lyan"
            rating={newSeason.personal_ratings.lyan}
            comment={newSeason.comments.lyan}
            onRatingChange={(value) => setNewSeason({
              ...newSeason,
              personal_ratings: {
                ...newSeason.personal_ratings,
                lyan: value
              }
            })}
            onCommentChange={(value) => setNewSeason({
              ...newSeason,
              comments: {
                ...newSeason.comments,
                lyan: value
              }
            })}
          />
          
          <RatingCommentSection
            person="nastya"
            rating={newSeason.personal_ratings.nastya}
            comment={newSeason.comments.nastya}
            onRatingChange={(value) => setNewSeason({
              ...newSeason,
              personal_ratings: {
                ...newSeason.personal_ratings,
                nastya: value
              }
            })}
            onCommentChange={(value) => setNewSeason({
              ...newSeason,
              comments: {
                ...newSeason.comments,
                nastya: value
              }
            })}
          />
        </div>
        
        <Button 
          type="button"
          onClick={addSeason}
          className="w-full bg-lavender-500 hover:bg-lavender-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Season
        </Button>
      </CardContent>
    </Card>
  );
}
