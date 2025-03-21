
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  CalendarDays, 
  Star, 
  ListTodo 
} from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortCategory, SortDirection, SortState } from './types';

interface MovieGridSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortState: SortState;
  setSortState: (state: SortState | ((prev: SortState) => SortState)) => void;
  activeTab: 'collection' | 'queue';
  setActiveTab: (tab: 'collection' | 'queue') => void;
  collectionCount: number;
  queueCount: number;
}

const MovieGridSearchBar = ({
  searchQuery,
  setSearchQuery,
  sortState,
  setSortState,
  activeTab,
  setActiveTab,
  collectionCount,
  queueCount
}: MovieGridSearchBarProps) => {
  const handleSortClick = (category: SortCategory) => {
    setSortState((prev: SortState) => {
      if (prev.category === category) {
        // Fix: Explicitly type the direction as SortDirection
        const newDirection: SortDirection = prev.direction === 'desc' ? 'asc' : 'desc';
        return {
          category,
          direction: newDirection
        };
      }
      return {
        category,
        direction: 'desc' as SortDirection
      };
    });
  };

  const getSortIcon = () => {
    return sortState.direction === 'desc' ? 
      <ArrowDown className="h-4 w-4" /> : 
      <ArrowUp className="h-4 w-4" />;
  };

  const getSortLabel = () => {
    const directionText = sortState.direction === 'desc' ? 'Newest' : 'Oldest';
    const highLowText = sortState.direction === 'desc' ? 'Highest' : 'Lowest';

    switch (sortState.category) {
      case 'recently_added': return `${directionText} Added`;
      case 'rating': return `${highLowText} IMDb Rating`;
      case 'year': return `${directionText} Released`;
      case 'personal': return `${highLowText} Personal Rating`;
      default: return 'Sort By';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Collection/Queue Tabs moved to the left */}
      <div>
        <TabsList className="h-10">
          <TabsTrigger 
            value="collection" 
            className="flex items-center gap-2"
            onClick={() => setActiveTab('collection')}
            data-state={activeTab === 'collection' ? 'active' : 'inactive'}
          >
            Collection
            <span className="bg-lavender-100 text-lavender-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {collectionCount}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="queue" 
            className="flex items-center gap-2"
            onClick={() => setActiveTab('queue')}
            data-state={activeTab === 'queue' ? 'active' : 'inactive'}
          >
            <ListTodo className="h-4 w-4" />
            Watch Queue
            <span className="bg-lavender-100 text-lavender-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {queueCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Search Bar (now with flex-1 for responsive sizing) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, genre, or comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm border-sakura-200 focus-visible:ring-sakura-400"
        />
      </div>
      
      {/* Sort Dropdown */}
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-sakura-200"
            >
              {sortState.category === 'recently_added' && <CalendarDays className="h-4 w-4" />}
              {sortState.category === 'rating' && <Star className="h-4 w-4" />}
              {sortState.category === 'personal' && <Star className="h-4 w-4 fill-current" />}
              {sortState.category === 'year' && <CalendarDays className="h-4 w-4" />}
              {getSortLabel()}
              {getSortIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-sakura-200">
            <DropdownMenuItem onClick={() => handleSortClick('recently_added')} className="cursor-pointer">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Recently Added</span>
              {sortState.category === 'recently_added' && getSortIcon()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortClick('personal')} className="cursor-pointer">
              <Star className="h-4 w-4 fill-current mr-2" />
              <span>Personal Rating</span>
              {sortState.category === 'personal' && getSortIcon()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortClick('rating')} className="cursor-pointer">
              <Star className="h-4 w-4 mr-2" />
              <span>IMDb Rating</span>
              {sortState.category === 'rating' && getSortIcon()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortClick('year')} className="cursor-pointer">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Release Date</span>
              {sortState.category === 'year' && getSortIcon()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MovieGridSearchBar;
