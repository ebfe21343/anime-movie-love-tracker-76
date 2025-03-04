
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SeasonHeaderProps {
  title: string;
  contentType?: string;
  onContentTypeChange?: (type: string) => void;
}

export function SeasonHeader({ 
  title,
  contentType = 'movie',
  onContentTypeChange 
}: SeasonHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      
      {/* Only show content type selector if onContentTypeChange is explicitly provided */}
      {onContentTypeChange && (
        <div className="w-48">
          <Label htmlFor="content-type" className="text-sm mb-1 block">Content Type</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => onContentTypeChange(value)}
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
      )}
    </div>
  );
}
