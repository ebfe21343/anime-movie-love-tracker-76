
import { Link } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StreamingLinkSectionProps {
  register: any;
}

const StreamingLinkSection = ({ register }: StreamingLinkSectionProps) => {
  return (
    <div>
      <Label htmlFor="watchLink" className="flex items-center gap-1">
        <Link className="h-3.5 w-3.5" />
        Streaming Link
      </Label>
      <Input
        id="watchLink"
        placeholder="https://..."
        className="mt-1.5"
        {...register('watch_link')}
      />
    </div>
  );
};

export default StreamingLinkSection;
