
import { Plus, Palette, Tv } from 'lucide-react';
import { Season } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import SeasonForm from '@/components/SeasonForm';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SeasonsDisplayProps {
  seasons: Season[];
  contentType: string;
  editMode: boolean;
  onSeasonsChange: (seasons: Season[]) => void;
  onContentTypeChange: (type: string) => void;
  setEditMode: (editMode: boolean) => void;
}

export const SeasonsDisplay = ({
  seasons,
  contentType,
  editMode,
  onSeasonsChange,
  onContentTypeChange,
  setEditMode,
}: SeasonsDisplayProps) => {
  const supportsSeasons = contentType === 'series' || contentType === 'anime';
  
  function getRatingBadgeColor(rating: number) {
    if (rating >= 8) return "bg-mint-500 text-white";
    if (rating >= 6) return "bg-lavender-500 text-white";
    if (rating >= 4) return "bg-amber-500 text-white";
    return "bg-sakura-500 text-white";
  }

  return (
    <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
      <CardContent className="p-6">
        {editMode ? (
          <SeasonForm
            seasons={seasons}
            onSeasonsChange={onSeasonsChange}
            contentType={contentType}
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Tv className="h-5 w-5 text-lavender-500" />
                Seasons
              </h3>
              
              <div className="flex items-center gap-3">
                {editMode && (
                  <div className="w-40">
                    <Select 
                      value={contentType} 
                      onValueChange={onContentTypeChange}
                    >
                      <SelectTrigger id="content-type" className="h-9">
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
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-lavender-500/10 border-lavender-200 text-lavender-900"
                  onClick={() => setEditMode(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {editMode ? "Save Changes" : "Manage Seasons"}
                </Button>
              </div>
            </div>
            
            {supportsSeasons ? (
              seasons && seasons.length > 0 ? (
                <div className="space-y-4">
                  {seasons.map((season) => (
                    <Card key={season.id} className="bg-white/40 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Season {season.season_number}</h4>
                            {season.title && (
                              <p className="text-sm text-muted-foreground">"{season.title}"</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{season.year}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className={cn(
                              "mr-2 font-bold",
                              getRatingBadgeColor((season.personal_ratings.lyan + season.personal_ratings.nastya) / 2)
                            )}>
                              {((season.personal_ratings.lyan + season.personal_ratings.nastya) / 2).toFixed(1)}/10
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-1">Lyan's Rating: {season.personal_ratings.lyan}/10</p>
                            {season.comments.lyan ? (
                              <p className="text-sm italic">{season.comments.lyan}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No comment</p>
                            )}
                          </div>
                          <div>
                            <p className="font-medium mb-1">Nastya's Rating: {season.personal_ratings.nastya}/10</p>
                            {season.comments.nastya ? (
                              <p className="text-sm italic">{season.comments.nastya}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No comment</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No seasons added yet</p>
                </div>
              )
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Season management is only available for series and anime.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { Calendar } from 'lucide-react';
