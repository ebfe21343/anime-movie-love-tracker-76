
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  lyanComment: string;
  nastyaComment: string;
  editMode: boolean;
  onLyanCommentChange?: (comment: string) => void;
  onNastyaCommentChange?: (comment: string) => void;
}

export const CommentsSection = ({
  lyanComment,
  nastyaComment,
  editMode,
  onLyanCommentChange,
  onNastyaCommentChange,
}: CommentsSectionProps) => {
  return (
    <>
      {!editMode ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/40 p-4 relative after:absolute after:top-4 after:left-0 after:w-1 after:h-8 after:bg-sakura-500 after:rounded-r overflow-hidden">
            <h4 className="font-medium mb-1">Lyan</h4>
            {lyanComment ? (
              <p className="text-sm">{lyanComment}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No comment yet</p>
            )}
          </div>
          
          <div className="rounded-xl bg-white/40 p-4 relative after:absolute after:top-4 after:left-0 after:w-1 after:h-8 after:bg-lavender-500 after:rounded-r overflow-hidden">
            <h4 className="font-medium mb-1">Nastya</h4>
            {nastyaComment ? (
              <p className="text-sm">{nastyaComment}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No comment yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <Label htmlFor="lyan-comment" className="mb-2 block">Lyan's Comment</Label>
            <Textarea
              id="lyan-comment"
              value={lyanComment}
              onChange={(e) => onLyanCommentChange?.(e.target.value)}
              placeholder="What did you think of this movie?"
              className="resize-none bg-white/50"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="nastya-comment" className="mb-2 block">Nastya's Comment</Label>
            <Textarea
              id="nastya-comment"
              value={nastyaComment}
              onChange={(e) => onNastyaCommentChange?.(e.target.value)}
              placeholder="What did Nastya think of this movie?"
              className="resize-none bg-white/50"
              rows={4}
            />
          </div>
        </div>
      )}
    </>
  );
};
