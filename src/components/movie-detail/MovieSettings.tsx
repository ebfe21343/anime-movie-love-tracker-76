
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MovieSettingsProps {
  contentType: string;
  cancelled: boolean;
  watchLink: string;
  onContentTypeChange: (type: string) => void;
  onCancelledChange: (cancelled: boolean) => void;
  onWatchLinkChange: (link: string) => void;
}

export const MovieSettings = ({
  contentType,
  cancelled,
  watchLink,
  onContentTypeChange,
  onCancelledChange,
  onWatchLinkChange,
}: MovieSettingsProps) => {
  return (
    <div className="space-y-3 pt-2">
      <div>
        <Label htmlFor="content-type" className="text-xs mb-1 block">Content Type</Label>
        <Select 
          value={contentType} 
          onValueChange={onContentTypeChange}
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
          onCheckedChange={(checked) => onCancelledChange(!!checked)}
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
          onChange={(e) => onWatchLinkChange(e.target.value)}
          placeholder="https://..."
          className="mt-1"
        />
      </div>
    </div>
  );
};
