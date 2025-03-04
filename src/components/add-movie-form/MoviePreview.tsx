
import { Star, Film, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MoviePreviewProps {
  preview: any;
  contentType: string;
}

const MoviePreview = ({ preview, contentType }: MoviePreviewProps) => {
  if (!preview) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-10 px-4 text-center bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Film className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Movie Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Enter an IMDb ID and click "Fetch" to preview movie details before adding it to your collection.
        </p>
      </div>
    );
  }

  const isSeries = contentType !== 'movie';

  return (
    <div className="animate-scale-in">
      <h3 className="text-lg font-medium mb-4">
        {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Preview
      </h3>
      <Card className="overflow-hidden border-none glass">
        <div className="flex flex-col lg:flex-row">
          {preview.posters && preview.posters[0] && (
            <div className="w-full lg:w-1/3 aspect-[2/3]">
              <img 
                src={preview.posters[0].url} 
                alt={preview.primary_title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="flex-1 p-5">
            <div className="mb-2 flex justify-between items-start">
              <h2 className="text-xl font-bold">{preview.primary_title}</h2>
              {preview.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold">
                    {preview.rating.aggregate_rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({preview.rating.votes_count.toLocaleString()} votes)
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Badge 
                className={isSeries ? 'bg-lavender-500' : 'bg-sakura-500'} 
                variant="default"
              >
                {isSeries ? (
                  <div className="flex items-center">
                    <Tv className="h-3.5 w-3.5 mr-1" />
                    {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Film className="h-3.5 w-3.5 mr-1" />
                    {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  </div>
                )}
              </Badge>
              <span>{preview.start_year}{preview.end_year ? ` - ${preview.end_year}` : ''}</span>
              {preview.runtime_minutes && (
                <span>
                  {Math.floor(preview.runtime_minutes / 60)}h {preview.runtime_minutes % 60}m
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {preview.genres?.map((genre: string) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm mb-4 line-clamp-3">{preview.plot}</p>
            
            <div className="text-sm">
              {preview.directors && preview.directors.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Director: </span>
                  {preview.directors.slice(0, 2).map((d: any, idx: number) => (
                    <span key={d.name.id}>
                      {d.name.display_name}
                      {idx < Math.min(preview.directors.length, 2) - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {preview.directors.length > 2 && ', ...'}
                </div>
              )}
              
              {preview.spoken_languages && preview.spoken_languages.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Language: </span>
                  {preview.spoken_languages.map((l: any, idx: number) => (
                    <span key={l.code}>
                      {l.name}
                      {idx < preview.spoken_languages.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              
              {preview.origin_countries && preview.origin_countries.length > 0 && (
                <div>
                  <span className="font-medium">Country: </span>
                  {preview.origin_countries.map((c: any, idx: number) => (
                    <span key={c.code}>
                      {c.name}
                      {idx < preview.origin_countries.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default MoviePreview;
