import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie, Season } from '@/types/movie';
import { Star, Clock, Calendar, Globe, Link as LinkIcon, Heart, ArrowLeft, Trash2, Tv, Plus, X, Film, Palette } from 'lucide-react';
import { updateMovieInCollection, removeMovieFromCollection } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import SeasonForm from '@/components/SeasonForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MovieDetailProps {
  movie: Movie;
  onUpdate: () => void;
  onDelete: () => void;
}

const MovieDetail = ({ movie, onUpdate, onDelete }: MovieDetailProps) => {
  const [editMode, setEditMode] = useState(false);
  const [watchLink, setWatchLink] = useState(movie.watch_link);
  const [lyanRating, setLyanRating] = useState(movie.personal_ratings.lyan);
  const [nastyaRating, setNastyaRating] = useState(movie.personal_ratings.nastya);
  const [lyanComment, setLyanComment] = useState(movie.comments.lyan);
  const [nastyaComment, setNastyaComment] = useState(movie.comments.nastya);
  const [seasons, setSeasons] = useState<Season[]>(movie.seasons || []);
  const [cancelled, setCancelled] = useState(movie.cancelled || false);
  const [contentType, setContentType] = useState(movie.content_type || movie.type || 'movie');
  
  const isSeries = contentType === 'series' || contentType === 'anime' || contentType === 'cartoon';
  
  useEffect(() => {
    setWatchLink(movie.watch_link);
    setLyanRating(movie.personal_ratings.lyan);
    setNastyaRating(movie.personal_ratings.nastya);
    setLyanComment(movie.comments.lyan);
    setNastyaComment(movie.comments.nastya);
    setSeasons(movie.seasons || []);
    setCancelled(movie.cancelled || false);
    setContentType(movie.content_type || movie.type || 'movie');
  }, [movie]);
  
  const handleContentTypeChange = (type: string) => {
    setContentType(type);
  };
  
  const handleSaveChanges = async () => {
    try {
      await updateMovieInCollection(movie.id, {
        watch_link: watchLink,
        personal_ratings: {
          lyan: lyanRating,
          nastya: nastyaRating,
        },
        comments: {
          lyan: lyanComment,
          nastya: nastyaComment,
        },
        cancelled: cancelled,
        content_type: contentType,
        seasons: isSeries ? seasons : undefined,
      });
      
      toast.success('Movie details updated!');
      setEditMode(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update movie details');
      console.error(error);
    }
  };
  
  const handleDeleteMovie = () => {
    try {
      removeMovieFromCollection(movie.id);
      toast.success('Movie removed from collection');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete movie');
      console.error(error);
    }
  };
  
  const poster = movie.posters[0]?.url || '/placeholder.svg';
  
  return (
    <div className="w-full animate-fade-in">
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
            onClick={() => setEditMode(!editMode)}
            className={editMode ? "bg-sakura-500 hover:bg-sakura-600" : ""}
          >
            {editMode ? "Cancel Editing" : "Edit Details"}
          </Button>
          
          {editMode && (
            <Button 
              variant="default" 
              size="sm"
              className="bg-mint-500 hover:bg-mint-600"
              onClick={handleSaveChanges}
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
                <p>Are you sure you want to remove <span className="font-semibold">{movie.primary_title}</span> from your collection?</p>
                <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteMovie}
                >
                  Remove Movie
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <Card className="overflow-hidden border-none glass rounded-2xl">
            <div className="relative aspect-[2/3]">
              <img 
                src={poster} 
                alt={movie.primary_title}
                className="object-cover w-full h-full"
              />
              
              {movie.is_adult && (
                <Badge variant="destructive" className="absolute top-3 right-3">
                  18+
                </Badge>
              )}
              
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {isSeries && (
                  <Badge 
                    variant="secondary" 
                    className="bg-lavender-500 text-white"
                  >
                    {contentType === 'cartoon' ? (
                      <>
                        <Palette className="h-3.5 w-3.5 mr-1" />
                        Cartoon
                      </>
                    ) : contentType === 'anime' ? (
                      <>
                        <Tv className="h-3.5 w-3.5 mr-1" />
                        Anime
                      </>
                    ) : (
                      <>
                        <Tv className="h-3.5 w-3.5 mr-1" />
                        Series
                      </>
                    )}
                  </Badge>
                )}
                
                {!isSeries && (
                  <Badge 
                    variant="secondary" 
                    className="bg-lavender-500 text-white"
                  >
                    <Film className="h-3.5 w-3.5 mr-1" />
                    Movie
                  </Badge>
                )}
                
                {movie.cancelled && (
                  <Badge 
                    className="bg-red-500 text-white border-red-400 flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelled
                  </Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-1 mb-4">
                {movie.genres.map(genre => (
                  <Badge 
                    key={genre} 
                    variant="secondary"
                    className="bg-lavender-500/80 text-white"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {movie.start_year}{movie.end_year ? ` - ${movie.end_year}` : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {Math.floor(movie.runtime_minutes / 60)}h {movie.runtime_minutes % 60}m
                  </span>
                </div>
                
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {movie.spoken_languages.map(l => l.name).join(', ')}
                    </span>
                  </div>
                )}
                
                {movie.certificates && movie.certificates.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs font-bold">R</span>
                    </div>
                    <span>
                      {movie.certificates[0].rating} ({movie.certificates[0].country.code})
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    <span className="font-medium">{movie.rating.aggregate_rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">
                      ({movie.rating.votes_count.toLocaleString()} votes)
                    </span>
                  </span>
                </div>
                
                {editMode && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label htmlFor="content-type" className="text-xs mb-1 block">Content Type</Label>
                      <Select 
                        value={contentType} 
                        onValueChange={handleContentTypeChange}
                      >
                        <SelectTrigger id="content-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cancelled" 
                        checked={cancelled} 
                        onCheckedChange={(checked) => setCancelled(!!checked)}
                      />
                      <Label htmlFor="cancelled" className="text-sm font-medium text-red-500">
                        Mark as Cancelled
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="watchLink" className="text-xs">Streaming Link</Label>
                      <Input
                        id="watchLink"
                        value={watchLink}
                        onChange={(e) => setWatchLink(e.target.value)}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {!editMode && movie.watch_link && (
                  <div className="pt-2">
                    <Button
                      variant="default"
                      className="w-full bg-sakura-500 hover:bg-sakura-600 btn-anime"
                      asChild
                    >
                      <a href={movie.watch_link} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Watch Now
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none glass rounded-2xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-sakura-500" />
                Personal Ratings
              </h3>
              
              {!editMode ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Lyan's Rating</span>
                      <Badge className={cn(
                        "font-bold",
                        getRatingBadgeColor(movie.personal_ratings.lyan)
                      )}>
                        {movie.personal_ratings.lyan}/10
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          getRatingBarColor(movie.personal_ratings.lyan)
                        )}
                        style={{ width: `${movie.personal_ratings.lyan * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Nastya's Rating</span>
                      <Badge className={cn(
                        "font-bold",
                        getRatingBadgeColor(movie.personal_ratings.nastya)
                      )}>
                        {movie.personal_ratings.nastya}/10
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          getRatingBarColor(movie.personal_ratings.nastya)
                        )}
                        style={{ width: `${movie.personal_ratings.nastya * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Average Rating</span>
                      <Badge variant="outline" className="font-bold">
                        {((movie.personal_ratings.lyan + movie.personal_ratings.nastya) / 2).toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="lyan-rating" className="text-sm">Lyan's Rating</Label>
                      <Badge variant="outline" className="font-bold">
                        {lyanRating}/10
                      </Badge>
                    </div>
                    <Slider
                      id="lyan-rating"
                      value={[lyanRating]}
                      max={10}
                      step={1}
                      onValueChange={(values) => setLyanRating(values[0])}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="nastya-rating" className="text-sm">Nastya's Rating</Label>
                      <Badge variant="outline" className="font-bold">
                        {nastyaRating}/10
                      </Badge>
                    </div>
                    <Slider
                      id="nastya-rating"
                      value={[nastyaRating]}
                      max={10}
                      step={1}
                      onValueChange={(values) => setNastyaRating(values[0])}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-2/3">
          <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-1">
                {movie.primary_title}
              </h1>
              
              {movie.original_title && movie.original_title !== movie.primary_title && (
                <p className="text-muted-foreground mb-4">
                  {movie.original_title}
                </p>
              )}
              
              <p className="mb-6 leading-relaxed">{movie.plot}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {movie.directors && movie.directors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Directed by</h4>
                    <ul className="space-y-1">
                      {movie.directors.map((director) => (
                        <li key={director.name.id} className="flex items-center gap-2">
                          {director.name.avatars && director.name.avatars[0] ? (
                            <img 
                              src={director.name.avatars[0].url} 
                              alt={director.name.display_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs">{director.name.display_name.charAt(0)}</span>
                            </div>
                          )}
                          <span>{director.name.display_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {movie.writers && movie.writers.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Written by</h4>
                    <ul className="space-y-1">
                      {movie.writers.slice(0, 3).map((writer) => (
                        <li key={writer.name.id} className="flex items-center gap-2">
                          {writer.name.avatars && writer.name.avatars[0] ? (
                            <img 
                              src={writer.name.avatars[0].url} 
                              alt={writer.name.display_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs">{writer.name.display_name.charAt(0)}</span>
                            </div>
                          )}
                          <span>{writer.name.display_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {movie.casts && movie.casts.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Cast</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {movie.casts.map((cast) => (
                      <div key={cast.name.id} className="text-center">
                        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
                          {cast.name.avatars && cast.name.avatars[0] ? (
                            <img 
                              src={cast.name.avatars[0].url} 
                              alt={cast.name.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-2xl font-bold">{cast.name.display_name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-sm line-clamp-1">{cast.name.display_name}</p>
                        {cast.characters && cast.characters[0] && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{cast.characters[0]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isSeries && (
            <Card className="border-none glass rounded-2xl overflow-hidden mb-6">
              <CardContent className="p-6">
                {editMode ? (
                  <SeasonForm
                    seasons={seasons}
                    onSeasonsChange={setSeasons}
                    contentType={contentType}
                    onContentTypeChange={handleContentTypeChange}
                  />
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-medium flex items-center gap-2">
                        {contentType === 'cartoon' ? (
                          <>
                            <Palette className="h-5 w-5 text-lavender-500" />
                            Seasons
                          </>
                        ) : (
                          <>
                            <Tv className="h-5 w-5 text-lavender-500" />
                            Seasons
                          </>
                        )}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-lavender-500/10 border-lavender-200 text-lavender-900"
                        onClick={() => setEditMode(true)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Manage Seasons
                      </Button>
                    </div>
                    
                    {seasons && seasons.length > 0 ? (
                      <div className="space-y-4">
                        {seasons.map((season) => (
                          <Card key={season.id} className="bg-white/40 overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex justify-between mb-3">
                                <div>
                                  <h4 className="font-medium">Season {season.season_number}</h4>
                                  {season.title && (
                                    <p className="text-sm text-muted-foreground">"{season.title}"</p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{season.year}</span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Badge className={cn(
                                    "mr-2 font-bold",
                                    getRatingBadgeColor((season.personal_ratings.lyan + season.personal_ratings.nastya) / 2)
                                  )}>
                                    {((season.personal_ratings.lyan + season.personal_ratings.nastya) / 2).toFixed(1)}/10
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium mb-1">Lyan's Rating: {season.personal_ratings.lyan}/10</p>
                                  {season.comments.lyan ? (
                                    <p className="text-sm italic">{season.comments.lyan}</p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">No comment</p>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium mb-1">Nastya's Rating: {season.personal_ratings.nastya}/10</p>
                                  {season.comments.nastya ? (
                                    <p className="text-sm italic">{season.comments.nastya}</p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">No comment</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">No seasons added yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card className="border-none glass rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Comments</h3>
              
              {!editMode ? (
                <div className="space-y-6">
                  <div className="rounded-xl bg-white/40 p-4 relative after:absolute after:top-4 after:left-0 after:w-1 after:h-8 after:bg-sakura-500 after:rounded-r overflow-hidden">
                    <h4 className="font-medium mb-1">Lyan</h4>
                    {movie.comments.lyan ? (
                      <p className="text-sm">{movie.comments.lyan}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No comment yet</p>
                    )}
                  </div>
                  
                  <div className="rounded-xl bg-white/40 p-4 relative after:absolute after:top-4 after:left-0 after:w-1 after:h-8 after:bg-lavender-500 after:rounded-r overflow-hidden">
                    <h4 className="font-medium mb-1">Nastya</h4>
                    {movie.comments.nastya ? (
                      <p className="text-sm">{movie.comments.nastya}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No comment yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="lyan-comment" className="mb-2 block">Lyan's Comment</Label>
                    <Textarea
                      id="lyan-comment"
                      value={lyanComment}
                      onChange={(e) => setLyanComment(e.target.value)}
                      placeholder="What did you think of this movie?"
                      className="resize-none bg-white/50"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nastya-comment" className="mb-2 block">Nastya's Comment</Label>
                    <Textarea
                      id="nastya-comment"
                      value={nastyaComment}
                      onChange={(e) => setNastyaComment(e.target.value)}
                      placeholder="What did Nastya think of this movie?"
                      className="resize-none bg-white/50"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function getRatingBadgeColor(rating: number) {
  if (rating >= 8) return "bg-mint-500 text-white";
  if (rating >= 6) return "bg-lavender-500 text-white";
  if (rating >= 4) return "bg-amber-500 text-white";
  return "bg-sakura-500 text-white";
}

function getRatingBarColor(rating: number) {
  if (rating >= 8) return "bg-mint-500";
  if (rating >= 6) return "bg-lavender-500";
  if (rating >= 4) return "bg-amber-500";
  return "bg-sakura-500";
}

export default MovieDetail;
