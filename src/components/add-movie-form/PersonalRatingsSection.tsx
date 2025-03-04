
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface PersonalRatingsSectionProps {
  lyanRating: number;
  nastyaRating: number;
  setLyanRating: (rating: number) => void;
  setNastyaRating: (rating: number) => void;
}

const PersonalRatingsSection = ({
  lyanRating,
  nastyaRating,
  setLyanRating,
  setNastyaRating
}: PersonalRatingsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Your Ratings</h3>
      
      {/* Nastya's rating first */}
      <div className="mb-4">
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
      </div>
      
      <div>
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
      </div>
    </div>
  );
};

export default PersonalRatingsSection;
