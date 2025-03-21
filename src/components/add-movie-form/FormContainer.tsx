
import PersonalRatingsSection from './PersonalRatingsSection';
import StreamingLinkSection from './StreamingLinkSection';
import CommentsSection from './CommentsSection';
import SubmitButtonSection from './SubmitButtonSection';

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
  inQueue?: boolean;
  waiting?: boolean;
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
  inQueue = false,
  waiting = false
}: FormContainerProps) => {
  const shouldShowRatings = !waiting && !inQueue;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {shouldShowRatings && (
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
        
        {shouldShowRatings && (
          <CommentsSection register={register} />
        )}
        
        <SubmitButtonSection
          isLoading={isLoading}
          preview={preview}
          contentType={contentType}
        />
      </div>
    </form>
  );
};

export default FormContainer;
