import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  lyanRating: number;
  nastyaRating: number;
  lyanWatched: boolean;
  nastyaWatched: boolean;
  editMode: boolean;
  waiting?: boolean;
  inQueue?: boolean;
  onLyanRatingChange?: (rating: number) => void;
  onNastyaRatingChange?: (rating: number) => void;
  onLyanWatchedChange?: (watched: boolean) => void;
  onNastyaWatchedChange?: (watched: boolean) => void;
}

export const RatingDisplay = ({
  lyanRating,
  nastyaRating,
  lyanWatched,
  nastyaWatched,
  editMode,
  waiting = false,
  inQueue = false,
  onLyanRatingChange,
  onNastyaRatingChange,
  onLyanWatchedChange,
  onNastyaWatchedChange,
}: RatingDisplayProps) => {
  function getRatingBadgeColor(rating: number) {
    if (rating >= 8) return "bg-mint-500 text-white";
    if (rating >= 6) return "bg-lavender-500 text-white";
    if (rating >= 4) return "bg-amber-500 text-white";
    return "bg-sakura-500 text-white";
  }
  
  function getRatingBarColor(rating: number) {
    if (rating >= 8) return "bg-mint-500";
    if (rating >= 6) return "bg-lavender-500";
    if (rating >= 4) return "bg-amber-500";
    return "bg-sakura-500";
  }

  // Calculate average of watched ratings only
  const calculateAverage = () => {
    let sum = 0;
    let count = 0;
    
    if (lyanWatched) {
      sum += lyanRating;
      count++;
    }
    
    if (nastyaWatched) {
      sum += nastyaRating;
      count++;
    }
    
    if (count === 0) return 0;
    return (sum / count).toFixed(1);
  };

  const averageRating = calculateAverage();
  
  // If the movie is in waiting list or queue, show a message instead of ratings
  if (waiting || inQueue) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg text-center">
        {waiting ? (
          <p className="text-sm text-muted-foreground">This movie is in your waiting list. You'll be able to rate it after watching.</p>
        ) : (
          <p className="text-sm text-muted-foreground">This movie is in your queue. You'll be able to rate it after watching.</p>
        )}
      </div>
    );
  }

  return (
    <>
      {!editMode ? (
        <div className="space-y-4">
          {lyanWatched ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Lyan's Rating</span>
                <Badge className={cn(
                  "font-bold",
                  getRatingBadgeColor(lyanRating)
                )}>
                  {lyanRating}/10
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    getRatingBarColor(lyanRating)
                  )}
                  style={{ width: `${lyanRating * 10}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Lyan's Rating</span>
                <span className="text-xs text-muted-foreground italic">Not watched yet</span>
              </div>
              <div className="h-2 bg-muted rounded-full" />
            </div>
          )}
          
          {nastyaWatched ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Nastya's Rating</span>
                <Badge className={cn(
                  "font-bold",
                  getRatingBadgeColor(nastyaRating)
                )}>
                  {nastyaRating}/10
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    getRatingBarColor(nastyaRating)
                  )}
                  style={{ width: `${nastyaRating * 10}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Nastya's Rating</span>
                <span className="text-xs text-muted-foreground italic">Not watched yet</span>
              </div>
              <div className="h-2 bg-muted rounded-full" />
            </div>
          )}
          
          {(lyanWatched || nastyaWatched) && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Average Rating</span>
                <Badge variant="outline" className="font-bold">
                  {averageRating}/10
                </Badge>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="lyan-watched-edit"
                checked={lyanWatched}
                onCheckedChange={(checked) => onLyanWatchedChange?.(checked === true)}
              />
              <Label htmlFor="lyan-watched-edit" className="text-sm cursor-pointer">
                Lyan watched this
              </Label>
            </div>
            
            {lyanWatched ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="lyan-rating" className="text-sm">Lyan's Rating</Label>
                  <Badge variant="outline" className="font-bold">
                    {lyanRating}/10
                  </Badge>
                </div>
                <Slider
                  id="lyan-rating"
                  value={[lyanRating]}
                  max={10}
                  step={1}
                  onValueChange={(values) => onLyanRatingChange?.(values[0])}
                />
              </>
            ) : (
              <div className="opacity-50">
                <p className="text-sm italic text-muted-foreground">
                  Lyan hasn't watched this yet
                </p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="nastya-watched-edit"
                checked={nastyaWatched}
                onCheckedChange={(checked) => onNastyaWatchedChange?.(checked === true)}
              />
              <Label htmlFor="nastya-watched-edit" className="text-sm cursor-pointer">
                Nastya watched this
              </Label>
            </div>
            
            {nastyaWatched ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="nastya-rating" className="text-sm">Nastya's Rating</Label>
                  <Badge variant="outline" className="font-bold">
                    {nastyaRating}/10
                  </Badge>
                </div>
                <Slider
                  id="nastya-rating"
                  value={[nastyaRating]}
                  max={10}
                  step={1}
                  onValueChange={(values) => onNastyaRatingChange?.(values[0])}
                />
              </>
            ) : (
              <div className="opacity-50">
                <p className="text-sm italic text-muted-foreground">
                  Nastya hasn't watched this yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
