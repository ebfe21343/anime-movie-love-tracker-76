
import PersonalRatingsSection from './PersonalRatingsSection';
import StreamingLinkSection from './StreamingLinkSection';
import CommentsSection from './CommentsSection';
import SubmitButtonSection from './SubmitButtonSection';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FormContainerProps {
  register: any;
  handleSubmit: any;
  onSubmit: (data: any) => Promise<void>;
  lyanRating: number;
  nastyaRating: number;
  lyanWatched: boolean;
  nastyaWatched: boolean;
  setLyanRating: (rating: number) => void;
  setNastyaRating: (rating: number) => void;
  setLyanWatched: (watched: boolean) => void;
  setNastyaWatched: (watched: boolean) => void;
  isLoading: boolean;
  preview: any;
  contentType: string;
  inQueue: boolean;
  setInQueue: (inQueue: boolean) => void;
}

const FormContainer = ({
  register,
  handleSubmit,
  onSubmit,
  lyanRating,
  nastyaRating,
  lyanWatched,
  nastyaWatched,
  setLyanRating,
  setNastyaRating,
  setLyanWatched,
  setNastyaWatched,
  isLoading,
  preview,
  contentType,
  inQueue,
  setInQueue
}: FormContainerProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="queue-mode"
            checked={inQueue}
            onCheckedChange={setInQueue}
          />
          <Label htmlFor="queue-mode" className="cursor-pointer">
            Add to Queue (not watched yet)
          </Label>
        </div>
        
        {!inQueue && (
          <PersonalRatingsSection
            lyanRating={lyanRating}
            nastyaRating={nastyaRating}
            lyanWatched={lyanWatched}
            nastyaWatched={nastyaWatched}
            setLyanRating={setLyanRating}
            setNastyaRating={setNastyaRating}
            setLyanWatched={setLyanWatched}
            setNastyaWatched={setNastyaWatched}
          />
        )}
        
        <StreamingLinkSection register={register} />
        
        {!inQueue && (
          <CommentsSection register={register} />
        )}
        
        <SubmitButtonSection
          isLoading={isLoading}
          preview={preview}
          contentType={contentType}
          inQueue={inQueue}
        />
      </div>
    </form>
  );
};

export default FormContainer;
