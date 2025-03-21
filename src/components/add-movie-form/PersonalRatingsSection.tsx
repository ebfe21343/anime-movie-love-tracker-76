
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface PersonalRatingsSectionProps {
  lyanRating: number;
  nastyaRating: number;
  lyanWatched: boolean;
  nastyaWatched: boolean;
  setLyanRating: (rating: number) => void;
  setNastyaRating: (rating: number) => void;
  setLyanWatched: (watched: boolean) => void;
  setNastyaWatched: (watched: boolean) => void;
}

const PersonalRatingsSection = ({
  lyanRating,
  nastyaRating,
  lyanWatched,
  nastyaWatched,
  setLyanRating,
  setNastyaRating,
  setLyanWatched,
  setNastyaWatched
}: PersonalRatingsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Your Ratings</h3>
      
      {/* Nastya's rating first */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="nastya-watched"
            checked={nastyaWatched}
            onCheckedChange={(checked) => setNastyaWatched(checked === true)}
          />
          <Label htmlFor="nastya-watched" className="text-sm cursor-pointer">
            Nastya watched this
          </Label>
        </div>
        
        {nastyaWatched ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="nastya-rating">Nastya's Rating</Label>
              <Badge variant="outline" className="font-bold">
                {nastyaRating}/10
              </Badge>
            </div>
            <Slider
              id="nastya-rating"
              defaultValue={[5]}
              max={10}
              step={1}
              value={[nastyaRating]}
              onValueChange={(values) => setNastyaRating(values[0])}
              className="py-2"
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
      
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Checkbox
            id="lyan-watched"
            checked={lyanWatched}
            onCheckedChange={(checked) => setLyanWatched(checked === true)}
          />
          <Label htmlFor="lyan-watched" className="text-sm cursor-pointer">
            Lyan watched this
          </Label>
        </div>
        
        {lyanWatched ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="lyan-rating">Lyan's Rating</Label>
              <Badge variant="outline" className="font-bold">
                {lyanRating}/10
              </Badge>
            </div>
            <Slider
              id="lyan-rating"
              defaultValue={[5]}
              max={10}
              step={1}
              value={[lyanRating]}
              onValueChange={(values) => setLyanRating(values[0])}
              className="py-2"
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
    </div>
  );
};

export default PersonalRatingsSection;
