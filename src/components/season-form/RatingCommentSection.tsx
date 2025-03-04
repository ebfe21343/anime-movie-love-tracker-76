
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface RatingCommentSectionProps {
  person: 'lyan' | 'nastya';
  rating: number;
  comment: string;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  id?: string;
}

export function RatingCommentSection({
  person,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  id = '',
}: RatingCommentSectionProps) {
  const personName = person.charAt(0).toUpperCase() + person.slice(1);
  const ratingId = id ? `${person}-rating-${id}` : `${person}-new-rating`;
  const commentId = id ? `${person}-comment-${id}` : `${person}-new-comment`;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={ratingId}>{personName}'s Rating</Label>
        <Badge variant="outline" className="font-bold">
          {rating}/10
        </Badge>
      </div>
      <Slider
        id={ratingId}
        value={[rating]}
        max={10}
        step={1}
        onValueChange={(values) => onRatingChange(values[0])}
      />
      <div className="mt-2">
        <Label htmlFor={commentId} className="text-sm">Comment</Label>
        <Textarea
          id={commentId}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="mt-1 resize-none h-20"
          placeholder={`${personName}'s thoughts...`}
        />
      </div>
    </div>
  );
}
