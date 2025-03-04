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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SeasonFormProps {
  seasons: Season[];
  onSeasonsChange: (seasons: Season[]) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
}

const SeasonForm = ({ seasons, onSeasonsChange, contentType, onContentTypeChange }: SeasonFormProps) => {
  const [newSeason, setNewSeason] = useState<Omit<Season, 'id'>>({
    season_number: (seasons.length > 0 ? Math.max(...seasons.map(s => s.season_number)) : 0) + 1,
    title: '',
    year: new Date().getFullYear(),
    episode_count: undefined,
    personal_ratings: { lyan: 5, nastya: 5 },
    comments: { lyan: '', nastya: '' },
    cancelled: false
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<number | null>(null);
  
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
      episode_count: undefined,
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium mb-4">Manage Seasons</h3>
        
        <div className="w-48">
          <Label htmlFor="content-type" className="text-sm mb-1 block">Content Type</Label>
          <Select value={contentType} onValueChange={onContentTypeChange}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movie">Movie</SelectItem>
              <SelectItem value="series">Series</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="anime">Anime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="lyan-new-rating">Lyan's Rating</Label>
                <Badge variant="outline" className="font-bold">
                  {newSeason.personal_ratings.lyan}/10
                </Badge>
              </div>
              <Slider
                id="lyan-new-rating"
                value={[newSeason.personal_ratings.lyan]}
                max={10}
                step={1}
                onValueChange={(values) => setNewSeason({
                  ...newSeason,
                  personal_ratings: {
                    ...newSeason.personal_ratings,
                    lyan: values[0]
                  }
                })}
              />
              <div className="mt-2">
                <Label htmlFor="lyan-new-comment" className="text-sm">Comment</Label>
                <Textarea
                  id="lyan-new-comment"
                  value={newSeason.comments.lyan}
                  onChange={(e) => setNewSeason({
                    ...newSeason,
                    comments: {
                      ...newSeason.comments,
                      lyan: e.target.value
                    }
                  })}
                  className="mt-1 resize-none h-20"
                  placeholder="Lyan's thoughts..."
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="nastya-new-rating">Nastya's Rating</Label>
                <Badge variant="outline" className="font-bold">
                  {newSeason.personal_ratings.nastya}/10
                </Badge>
              </div>
              <Slider
                id="nastya-new-rating"
                value={[newSeason.personal_ratings.nastya]}
                max={10}
                step={1}
                onValueChange={(values) => setNewSeason({
                  ...newSeason,
                  personal_ratings: {
                    ...newSeason.personal_ratings,
                    nastya: values[0]
                  }
                })}
              />
              <div className="mt-2">
                <Label htmlFor="nastya-new-comment" className="text-sm">Comment</Label>
                <Textarea
                  id="nastya-new-comment"
                  value={newSeason.comments.nastya}
                  onChange={(e) => setNewSeason({
                    ...newSeason,
                    comments: {
                      ...newSeason.comments,
                      nastya: e.target.value
                    }
                  })}
                  className="mt-1 resize-none h-20"
                  placeholder="Nastya's thoughts..."
                />
              </div>
            </div>
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
      
      <h4 className="font-medium">Existing Seasons</h4>
      {seasons.length > 0 ? (
        <div className="space-y-4">
          {seasons.map((season, index) => (
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
                        const updatedSeasons = [...seasons];
                        updatedSeasons[index] = {
                          ...updatedSeasons[index],
                          season_number: parseInt(e.target.value) || 1
                        };
                        onSeasonsChange(updatedSeasons);
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
                        const updatedSeasons = [...seasons];
                        updatedSeasons[index] = {
                          ...updatedSeasons[index],
                          title: e.target.value
                        };
                        onSeasonsChange(updatedSeasons);
                      }}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`season_year_${index}`}>Year</Label>
                    <Input
                      id={`season_year_${index}`}
                      type="number"
                      value={season.year}
                      onChange={(e) => {
                        const updatedSeasons = [...seasons];
                        updatedSeasons[index] = {
                          ...updatedSeasons[index],
                          year: parseInt(e.target.value) || new Date().getFullYear()
                        };
                        onSeasonsChange(updatedSeasons);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="mb-4 flex items-center">
                  <Label htmlFor={`cancelled_${index}`} className="flex items-center cursor-pointer">
                    <input
                      id={`cancelled_${index}`}
                      type="checkbox"
                      checked={season.cancelled}
                      onChange={(e) => updateSeasonCancelled(index, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500 mr-2"
                    />
                    <span className="text-sm">Mark as Cancelled</span>
                  </Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={`lyan-rating-${index}`}>Lyan's Rating</Label>
                      <Badge variant="outline" className="font-bold">
                        {season.personal_ratings.lyan}/10
                      </Badge>
                    </div>
                    <Slider
                      id={`lyan-rating-${index}`}
                      value={[season.personal_ratings.lyan]}
                      max={10}
                      step={1}
                      onValueChange={(values) => updateSeasonRating(index, 'lyan', values[0])}
                    />
                    <div className="mt-2">
                      <Label htmlFor={`lyan-comment-${index}`} className="text-sm">Comment</Label>
                      <Textarea
                        id={`lyan-comment-${index}`}
                        value={season.comments.lyan}
                        onChange={(e) => updateSeasonComment(index, 'lyan', e.target.value)}
                        className="mt-1 resize-none h-20"
                        placeholder="Lyan's thoughts..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor={`nastya-rating-${index}`}>Nastya's Rating</Label>
                      <Badge variant="outline" className="font-bold">
                        {season.personal_ratings.nastya}/10
                      </Badge>
                    </div>
                    <Slider
                      id={`nastya-rating-${index}`}
                      value={[season.personal_ratings.nastya]}
                      max={10}
                      step={1}
                      onValueChange={(values) => updateSeasonRating(index, 'nastya', values[0])}
                    />
                    <div className="mt-2">
                      <Label htmlFor={`nastya-comment-${index}`} className="text-sm">Comment</Label>
                      <Textarea
                        id={`nastya-comment-${index}`}
                        value={season.comments.nastya}
                        onChange={(e) => updateSeasonComment(index, 'nastya', e.target.value)}
                        className="mt-1 resize-none h-20"
                        placeholder="Nastya's thoughts..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No seasons added yet</p>
        </div>
      )}
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Season</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this season? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={removeSeason}
            >
              Remove Season
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeasonForm;
