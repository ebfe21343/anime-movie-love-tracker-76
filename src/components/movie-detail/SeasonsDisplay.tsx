
import { useEffect, useState } from 'react';
import { Season } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { SeasonList } from '../season-form/SeasonList';
import { EmptySeasonsList } from '../season-form/EmptySeasonsList';
import { SeasonHeader } from '../season-form/SeasonHeader';
import { SeasonsFormManager } from '../season-form/SeasonsFormManager';

interface SeasonsDisplayProps {
  seasons: Season[];
  contentType: string;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  onSeasonsChange: (seasons: Season[]) => void;
  onContentTypeChange: (type: string) => void;
  inQueue?: boolean;
}

export const SeasonsDisplay = ({
  seasons,
  contentType,
  editMode,
  setEditMode,
  onSeasonsChange,
  onContentTypeChange,
  inQueue = false
}: SeasonsDisplayProps) => {
  // Only render if it's actually a series or anime type content
  if (contentType !== 'series' && contentType !== 'anime') {
    return null;
  }
  
  // Empty state when no seasons are available
  if (seasons.length === 0 && !editMode) {
    return (
      <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No seasons added yet for this {contentType === 'anime' ? 'anime' : 'series'}.
            </p>
            <Button
              onClick={() => setEditMode(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Seasons
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Main seasons display with edit capability
  return (
    <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
      <CardContent className="p-6">
        <SeasonHeader 
          contentType={contentType} 
          seasonsCount={seasons.length}
          inQueue={inQueue}
        />
        
        {editMode ? (
          <SeasonsFormManager
            seasons={seasons}
            onSeasonsChange={onSeasonsChange}
            contentType={contentType}
            onContentTypeChange={onContentTypeChange}
          />
        ) : (
          <>
            <SeasonList 
              seasons={seasons} 
              contentType={contentType}
              inQueue={inQueue}
            />
            
            <div className="mt-6">
              <Button 
                onClick={() => setEditMode(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Seasons
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
