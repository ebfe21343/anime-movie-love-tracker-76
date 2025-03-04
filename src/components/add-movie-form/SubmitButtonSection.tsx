
import { Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonSectionProps {
  isLoading: boolean;
  preview: any;
  isSeries: boolean;
  contentType: string;
}

const SubmitButtonSection = ({
  isLoading,
  preview,
  isSeries,
  contentType
}: SubmitButtonSectionProps) => {
  return (
    <div className="pt-2">
      <Button 
        type="submit" 
        className="w-full bg-sakura-500 hover:bg-sakura-600 btn-anime"
        disabled={isLoading || !preview}
      >
        {isSeries ? (
          <Tv className="h-4 w-4 mr-2" />
        ) : (
          <Film className="h-4 w-4 mr-2" />
        )}
        Add {contentType.charAt(0).toUpperCase() + contentType.slice(1)} to Collection
      </Button>
    </div>
  );
};

export default SubmitButtonSection;
