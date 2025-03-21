
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Save, ArrowLeft, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieDetailHeaderProps {
  movieTitle: string;
  editMode: boolean;
  onEditToggle: () => void;
  onSaveChanges: () => void;
  onDelete: () => void;
  inQueue?: boolean;
}

export function MovieDetailHeader({ 
  movieTitle, 
  editMode, 
  onEditToggle, 
  onSaveChanges, 
  onDelete,
  inQueue = false
}: MovieDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          asChild
          className="rounded-full shrink-0"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold line-clamp-1">
          {movieTitle} {inQueue && <span className="text-amber-500">(In Queue)</span>}
        </h1>
      </div>

      <div className="flex gap-2 self-end sm:self-auto">
        {editMode ? (
          <Button 
            variant="default" 
            className="bg-lavender-600 hover:bg-lavender-700"
            onClick={onSaveChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onEditToggle}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{movieTitle}" from your collection.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
