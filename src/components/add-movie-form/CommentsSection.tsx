
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  register: any;
}

const CommentsSection = ({ register }: CommentsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Your Comments</h3>
      
      {/* Nastya's comment first */}
      <div className="mb-4">
        <Label htmlFor="nastya-comment">Nastya's Comment</Label>
        <Textarea
          id="nastya-comment"
          placeholder="What did Nastya think of this movie?"
          className="mt-1.5 resize-none"
          rows={3}
          {...register('comments.nastya')}
        />
      </div>
      
      <div>
        <Label htmlFor="lyan-comment">Lyan's Comment</Label>
        <Textarea
          id="lyan-comment"
          placeholder="What did you think of this movie?"
          className="mt-1.5 resize-none"
          rows={3}
          {...register('comments.lyan')}
        />
      </div>
    </div>
  );
};

export default CommentsSection;
