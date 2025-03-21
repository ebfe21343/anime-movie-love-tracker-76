
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, CalendarDays, Star } from 'lucide-react';
import { Movie } from '@/types/movie';

export type SortCategory = 'recently_added' | 'rating' | 'year' | 'personal';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  category: SortCategory;
  direction: SortDirection;
}

interface MovieGridSearchBarProps {
  movies: Movie[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  sortState?: SortState;
  handleSortClick?: (category: SortCategory) => void;
  getSortLabel?: () => string;
  getSortIcon?: () => any;
  isQueueView?: boolean;
  isWaitingView?: boolean;
}

const MovieGridSearchBar = ({ 
  movies,
  searchQuery = '',
  setSearchQuery = () => {},
  sortState = { category: 'recently_added', direction: 'desc' },
  handleSortClick = () => {},
  getSortLabel = () => 'Sort By',
  getSortIcon = () => null,
  isQueueView = false,
  isWaitingView = false
}: MovieGridSearchBarProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localSortState, setLocalSortState] = useState<SortState>({
    category: 'recently_added',
    direction: 'desc'
  });
  
  // Determine if we're using props or local state
  const actualSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;
  const actualSetSearchQuery = setSearchQuery || setLocalSearchQuery;
  const actualSortState = sortState || localSortState;
  
  // Local sort handler if no external one is provided
  const actualHandleSortClick = (category: SortCategory) => {
    if (handleSortClick) {
      handleSortClick(category);
    } else {
      setLocalSortState(prev => {
        if (prev.category === category) {
          return {
            category,
            direction: prev.direction === 'desc' ? 'asc' : 'desc'
          };
        }
        return {
          category,
          direction: 'desc'
        };
      });
    }
  };
  
  // Get appropriate icon
  const SortIconComponent = getSortIcon();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-1">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, genre, or comments..."
          value={actualSearchQuery}
          onChange={(e) => actualSetSearchQuery(e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm border-sakura-200 focus-visible:ring-sakura-400"
        />
      </div>
      
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-sakura-200"
            >
              {actualSortState.category === 'recently_added' && <CalendarDays className="h-4 w-4" />}
              {actualSortState.category === 'rating' && <Star className="h-4 w-4" />}
              {actualSortState.category === 'personal' && <Star className="h-4 w-4 fill-current" />}
              {actualSortState.category === 'year' && <CalendarDays className="h-4 w-4" />}
              {getSortLabel()}
              {SortIconComponent && <SortIconComponent className="h-4 w-4 ml-2" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-sakura-200">
            <DropdownMenuItem onClick={() => actualHandleSortClick('recently_added')} className="cursor-pointer">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Recently Added</span>
              {actualSortState.category === 'recently_added' && (
                SortIconComponent && <SortIconComponent className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => actualHandleSortClick('personal')} className="cursor-pointer">
              <Star className="h-4 w-4 fill-current mr-2" />
              <span>Personal Rating</span>
              {actualSortState.category === 'personal' && (
                SortIconComponent && <SortIconComponent className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => actualHandleSortClick('rating')} className="cursor-pointer">
              <Star className="h-4 w-4 mr-2" />
              <span>IMDb Rating</span>
              {actualSortState.category === 'rating' && (
                SortIconComponent && <SortIconComponent className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => actualHandleSortClick('year')} className="cursor-pointer">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Release Date</span>
              {actualSortState.category === 'year' && (
                SortIconComponent && <SortIconComponent className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MovieGridSearchBar;
