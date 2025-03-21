
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinkIcon, CheckCircle, Clock } from "lucide-react";

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

export function MovieSettings({
  contentType,
  cancelled,
  watchLink,
  inQueue = false,
  onContentTypeChange,
  onCancelledChange,
  onWatchLinkChange,
  onInQueueChange
}: MovieSettingsProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="content-type">Content Type</Label>
        <Select
          value={contentType}
          onValueChange={onContentTypeChange}
        >
          <SelectTrigger id="content-type">
            <SelectValue placeholder="Select a content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="movie">Movie</SelectItem>
            <SelectItem value="series">Series</SelectItem>
            <SelectItem value="cartoon">Cartoon</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="watch-link">Streaming Link (optional)</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="watch-link"
            value={watchLink}
            onChange={(e) => onWatchLinkChange(e.target.value)}
            placeholder="https://..."
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="cancelled"
            checked={cancelled}
            onCheckedChange={onCancelledChange}
          />
          <Label htmlFor="cancelled" className="cursor-pointer">Mark as Cancelled</Label>
        </div>
      </div>
      
      {onInQueueChange && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Switch 
              id="in-queue"
              checked={inQueue}
              onCheckedChange={onInQueueChange}
            />
            <Label htmlFor="in-queue" className="cursor-pointer flex items-center gap-1">
              {inQueue ? (
                <>
                  <Clock className="h-4 w-4 text-amber-500" />
                  In Queue (Not Watched)
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Completed
                </>
              )}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
