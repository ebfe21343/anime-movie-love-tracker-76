
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieGridEmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  icon?: React.ReactNode;
  title?: string;
  message?: string;
}

const MovieGridEmptyState = ({ 
  searchQuery, 
  onClearSearch,
  icon = <Search className="h-8 w-8 text-muted-foreground" />,
  title = "No movies found",
  message
}: MovieGridEmptyStateProps) => {
  const defaultMessage = searchQuery 
    ? `No movies match "${searchQuery}"`
    : "Your collection is empty. Add your first movie!";

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message || defaultMessage}
      </p>
      {searchQuery && onClearSearch && (
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

export default MovieGridEmptyState;
