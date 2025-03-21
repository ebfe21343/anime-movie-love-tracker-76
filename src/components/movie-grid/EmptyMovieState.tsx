
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface EmptyMovieStateProps {
  searchQuery: string;
  activeTab: 'collection' | 'queue';
  onClearSearch: () => void;
}

const EmptyMovieState = ({ searchQuery, activeTab, onClearSearch }: EmptyMovieStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No movies found</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery 
          ? `No movies match "${searchQuery}"`
          : activeTab === 'queue'
            ? "Your watch queue is empty. Add movies to your queue when adding new movies."
            : "Your collection is empty. Add your first movie!"
        }
      </p>
      {searchQuery && (
        <Button 
          variant="outline" 
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default EmptyMovieState;
