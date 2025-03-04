
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonSectionProps {
  isLoading: boolean;
  preview: any;
  contentType: string;
}

const SubmitButtonSection = ({ isLoading, preview, contentType }: SubmitButtonSectionProps) => {
  const isSeries = contentType !== 'movie';
  
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isLoading || !preview}
        className="bg-sakura-500 hover:bg-sakura-600 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding {isSeries ? contentType : 'movie'}...
          </>
        ) : (
          <>Add to Collection</>
        )}
      </Button>
    </div>
  );
};

export default SubmitButtonSection;
