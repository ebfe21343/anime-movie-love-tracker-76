
import { Season } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SeasonListProps {
  seasons: Season[];
  contentType: string;
  inQueue?: boolean;
}

export function SeasonList({ seasons, contentType, inQueue = false }: SeasonListProps) {
  function formatSeasonName(season: Season) {
    return season.title
      ? `Season ${season.season_number}: ${season.title}`
      : `Season ${season.season_number}`;
  }

  function getRatingBadgeColor(rating: number) {
    if (rating >= 8) return "bg-mint-500 text-white";
    if (rating >= 6) return "bg-lavender-500 text-white";
    if (rating >= 4) return "bg-amber-500 text-white";
    return "bg-sakura-500 text-white";
  }

  return (
    <div className="space-y-4">
      {seasons
        .sort((a, b) => a.season_number - b.season_number)
        .map((season) => (
          <Card 
            key={season.id} 
            className={cn(
              "bg-white/40 border-none overflow-hidden", 
              season.cancelled && "opacity-70"
            )}
          >
            <CardContent className="p-4">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <h4 className="font-medium">{formatSeasonName(season)}</h4>
                
                {season.cancelled && (
                  <Badge variant="outline" className="border-destructive text-destructive">
                    Cancelled
                  </Badge>
                )}
              </div>
              
              {!inQueue && (
                <div className="space-y-2">
                  {/* Only show ratings if season is watched */}
                  {season.watched_by?.nastya !== false && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nastya's Rating</span>
                      <Badge className={cn(
                        "font-bold",
                        getRatingBadgeColor(season.personal_ratings.nastya)
                      )}>
                        {season.personal_ratings.nastya}/10
                      </Badge>
                    </div>
                  )}
                  
                  {season.watched_by?.lyan !== false && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lyan's Rating</span>
                      <Badge className={cn(
                        "font-bold",
                        getRatingBadgeColor(season.personal_ratings.lyan)
                      )}>
                        {season.personal_ratings.lyan}/10
                      </Badge>
                    </div>
                  )}
                  
                  {/* Comments Section */}
                  {(season.comments.nastya || season.comments.lyan) && (
                    <div className="mt-4 space-y-2">
                      {season.comments.nastya && season.watched_by?.nastya !== false && (
                        <div className="bg-white/50 p-2 rounded-md">
                          <p className="text-xs font-medium mb-1">Nastya:</p>
                          <p className="text-xs">{season.comments.nastya}</p>
                        </div>
                      )}
                      
                      {season.comments.lyan && season.watched_by?.lyan !== false && (
                        <div className="bg-white/50 p-2 rounded-md">
                          <p className="text-xs font-medium mb-1">Lyan:</p>
                          <p className="text-xs">{season.comments.lyan}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
