
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface MovieDetailHeaderProps {
  movieTitle: string;
  editMode: boolean;
  onEditToggle: () => void;
  onSaveChanges: () => void;
  onDelete: () => void;
}

export const MovieDetailHeader = ({
  movieTitle,
  editMode,
  onEditToggle,
  onSaveChanges,
  onDelete,
}: MovieDetailHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2"
        asChild
      >
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Collection</span>
        </Link>
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant={editMode ? "default" : "outline"} 
          size="sm"
          onClick={onEditToggle}
          className={editMode ? "bg-sakura-500 hover:bg-sakura-600" : ""}
        >
          {editMode ? "Cancel Editing" : "Edit Details"}
        </Button>
        
        {editMode && (
          <Button 
            variant="default" 
            size="sm"
            className="bg-mint-500 hover:bg-mint-600"
            onClick={onSaveChanges}
          >
            Save Changes
          </Button>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Movie</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to remove <span className="font-semibold">{movieTitle}</span> from your collection?</p>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDelete}
              >
                Remove Movie
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
