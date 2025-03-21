
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface MovieSettingsProps {
  contentType: string;
  cancelled: boolean;
  watchLink: string;
  inQueue?: boolean;
  onContentTypeChange: (type: string) => void;
  onCancelledChange: (cancelled: boolean) => void;
  onWatchLinkChange: (link: string) => void;
  onInQueueChange?: (inQueue: boolean) => void;
}

export const MovieSettings = ({
  contentType,
  cancelled,
  watchLink,
  inQueue = false,
  onContentTypeChange,
  onCancelledChange,
  onWatchLinkChange,
  onInQueueChange,
}: MovieSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content-type" className="text-sm">Content Type</Label>
        <Select
          value={contentType}
          onValueChange={onContentTypeChange}
        >
          <SelectTrigger id="content-type" className="mt-1.5 bg-white/50">
            <SelectValue placeholder="Select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="movie">Movie</SelectItem>
            <SelectItem value="series">Series</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="watch-link" className="text-sm">Watch Link</Label>
        <Input
          id="watch-link"
          type="url"
          value={watchLink}
          onChange={(e) => onWatchLinkChange(e.target.value)}
          placeholder="https://example.com/watch"
          className="mt-1.5 bg-white/50"
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cancelled"
            checked={cancelled}
            onCheckedChange={(checked) => onCancelledChange(checked === true)}
          />
          <Label htmlFor="cancelled" className="text-sm cursor-pointer">
            Mark as Cancelled
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-queue"
            checked={inQueue}
            onCheckedChange={(checked) => onInQueueChange?.(checked === true)}
          />
          <Label htmlFor="in-queue" className="text-sm cursor-pointer">
            Add to Watch Queue
          </Label>
        </div>
      </div>
    </div>
  );
};
