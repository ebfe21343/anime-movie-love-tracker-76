
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
  waiting: boolean;
  inQueue: boolean;
  onContentTypeChange: (type: string) => void;
  onCancelledChange: (cancelled: boolean) => void;
  onWatchLinkChange: (link: string) => void;
  onWaitingChange: (waiting: boolean) => void;
  onInQueueChange: (inQueue: boolean) => void;
}

export const MovieSettings = ({
  contentType,
  cancelled,
  watchLink,
  waiting,
  inQueue,
  onContentTypeChange,
  onCancelledChange,
  onWatchLinkChange,
  onWaitingChange,
  onInQueueChange,
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

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="waiting" 
          checked={waiting} 
          onCheckedChange={(checked) => {
            onWaitingChange(!!checked);
            if (checked) onInQueueChange(false); // Disable inQueue if waiting is enabled
          }}
        />
        <Label htmlFor="waiting" className="text-sm font-medium">
          Add to Waiting List
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="inQueue" 
          checked={inQueue} 
          onCheckedChange={(checked) => {
            onInQueueChange(!!checked);
            if (checked) onWaitingChange(false); // Disable waiting if inQueue is enabled
          }}
        />
        <Label htmlFor="inQueue" className="text-sm font-medium">
          Add to Queue
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
