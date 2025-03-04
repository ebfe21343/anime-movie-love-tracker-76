
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  lyanRating: number;
  nastyaRating: number;
  editMode: boolean;
  onLyanRatingChange?: (rating: number) => void;
  onNastyaRatingChange?: (rating: number) => void;
}

export const RatingDisplay = ({
  lyanRating,
  nastyaRating,
  editMode,
  onLyanRatingChange,
  onNastyaRatingChange,
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

  return (
    <>
      {!editMode ? (
        <div className="space-y-4">
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
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Average Rating</span>
              <Badge variant="outline" className="font-bold">
                {((lyanRating + nastyaRating) / 2).toFixed(1)}/10
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
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
          </div>
          
          <div>
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
          </div>
        </div>
      )}
    </>
  );
};
