
interface SeasonHeaderProps {
  contentType: string;
  seasonsCount: number;
  inQueue?: boolean;
}

export function SeasonHeader({ contentType, seasonsCount, inQueue = false }: SeasonHeaderProps) {
  const title = contentType === 'anime' ? 'Anime Seasons' : 'TV Seasons';
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-medium flex items-center gap-2">
        {title}
        <span className="text-sm font-normal text-muted-foreground">
          ({seasonsCount} {seasonsCount === 1 ? 'season' : 'seasons'})
        </span>
        {inQueue && (
          <span className="text-xs bg-sakura-100 text-sakura-800 px-2 py-0.5 rounded-full">
            In Watch Queue
          </span>
        )}
      </h3>
    </div>
  );
}
