
import { useState } from 'react';
import { Plus, Minus, Calendar, X } from 'lucide-react';
import { Season } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SeasonFormProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
}

const SeasonForm = ({ seasons, onSeasonsChange }: SeasonFormProps) => {
  const [isAddingNewSeason, setIsAddingNewSeason] = useState(false);
  const [newSeason, setNewSeason] = useState<Omit<Season, 'id'>>({
    season_number: (seasons.length > 0 ? Math.max(...seasons.map(s => s.season_number)) : 0) + 1,
    title: '',
    year: new Date().getFullYear(),
    personal_ratings: { lyan: 5, nastya: 5 },
    comments: { lyan: '', nastya: '' }
  });
  
  const addSeason = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the event from bubbling up to any parent forms
    e.preventDefault();
    
    if (!newSeason.title.trim()) {
      return; // Don't add empty seasons
    }
    
    // Create new season with unique ID
    const seasonToAdd: Season = {
      ...newSeason,
      id: `s_${new Date().getTime()}`
    };
    
    onSeasonsChange([...seasons, seasonToAdd]);
    
    // Reset form
    setIsAddingNewSeason(false);
    setNewSeason({
      season_number: seasonToAdd.season_number + 1,
      title: '',
      year: new Date().getFullYear(),
      personal_ratings: { lyan: 5, nastya: 5 },
      comments: { lyan: '', nastya: '' }
    });
  };
  
  const removeSeason = (index: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons.splice(index, 1);
    onSeasonsChange(updatedSeasons);
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
  
  const updateNewSeasonField = (field: keyof Omit<Season, 'id' | 'personal_ratings' | 'comments'>, value: any) => {
    setNewSeason({ ...newSeason, [field]: value });
  };
  
  const toggleAddSeason = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the event from bubbling up to any parent forms
    e.preventDefault();
    setIsAddingNewSeason(!isAddingNewSeason);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Seasons</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleAddSeason}
          className="flex items-center gap-1"
          type="button" // Explicitly set type to button to prevent form submission
        >
          {isAddingNewSeason ? (
            <>
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Season</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Add New Season Form */}
      {isAddingNewSeason && (
        <Card className="border border-lavender-300">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Add New Season</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <Label htmlFor="season-number">Season Number</Label>
                <Input
                  id="season-number"
                  type="number"
                  value={newSeason.season_number}
                  min={1}
                  onChange={(e) => updateNewSeasonField('season_number', parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="season-year">Year</Label>
                <Input
                  id="season-year"
                  type="number"
                  value={newSeason.year}
                  min={1900}
                  max={2100}
                  onChange={(e) => updateNewSeasonField('year', parseInt(e.target.value) || new Date().getFullYear())}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <Label htmlFor="season-title">Season Title (optional)</Label>
              <Input
                id="season-title"
                value={newSeason.title}
                onChange={(e) => updateNewSeasonField('title', e.target.value)}
                placeholder="e.g. The Beginning"
                className="mt-1"
              />
            </div>
            
            <div className="mb-3">
              <Label htmlFor="episode-count">Episode Count (optional)</Label>
              <Input
                id="episode-count"
                type="number"
                min={1}
                value={newSeason.episode_count || ''}
                onChange={(e) => updateNewSeasonField('episode_count', parseInt(e.target.value) || undefined)}
                className="mt-1"
              />
            </div>
            
            <Button 
              variant="default" 
              className="w-full bg-sakura-500 hover:bg-sakura-600"
              onClick={addSeason}
              type="button" // Explicitly set type to button to prevent form submission
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Season
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Seasons List */}
      {seasons.length > 0 ? (
        <div className="space-y-3">
          {seasons.map((season, index) => (
            <Card key={season.id} className="border border-lavender-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Season {season.season_number}</h4>
                      {season.title && (
                        <span className="text-muted-foreground">"{season.title}"</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{season.year}</span>
                      {season.episode_count && (
                        <Badge variant="outline" className="ml-1">
                          {season.episode_count} episodes
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeSeason(index)}
                    type="button" // Explicitly set type to button to prevent form submission
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Ratings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor={`season-${index}-lyan-rating`}>Lyan's Rating</Label>
                        <Badge variant="outline" className="font-bold">
                          {season.personal_ratings.lyan}/10
                        </Badge>
                      </div>
                      <Slider
                        id={`season-${index}-lyan-rating`}
                        max={10}
                        step={1}
                        value={[season.personal_ratings.lyan]}
                        onValueChange={(values) => updateSeasonRating(index, 'lyan', values[0])}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor={`season-${index}-nastya-rating`}>Nastya's Rating</Label>
                        <Badge variant="outline" className="font-bold">
                          {season.personal_ratings.nastya}/10
                        </Badge>
                      </div>
                      <Slider
                        id={`season-${index}-nastya-rating`}
                        max={10}
                        step={1}
                        value={[season.personal_ratings.nastya]}
                        onValueChange={(values) => updateSeasonRating(index, 'nastya', values[0])}
                      />
                    </div>
                  </div>
                  
                  {/* Comments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`season-${index}-lyan-comment`}>Lyan's Comment</Label>
                      <Textarea
                        id={`season-${index}-lyan-comment`}
                        value={season.comments.lyan}
                        onChange={(e) => updateSeasonComment(index, 'lyan', e.target.value)}
                        placeholder="Lyan's thoughts on this season..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`season-${index}-nastya-comment`}>Nastya's Comment</Label>
                      <Textarea
                        id={`season-${index}-nastya-comment`}
                        value={season.comments.nastya}
                        onChange={(e) => updateSeasonComment(index, 'nastya', e.target.value)}
                        placeholder="Nastya's thoughts on this season..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">No seasons added yet</p>
        </div>
      )}
    </div>
  );
};

export default SeasonForm;
