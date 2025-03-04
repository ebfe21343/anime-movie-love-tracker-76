
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
  setLyanRating: (rating: number) => void;
  setNastyaRating: (rating: number) => void;
  isLoading: boolean;
  preview: any;
  isSeries: boolean;
  contentType: string;
}

const FormContainer = ({
  register,
  handleSubmit,
  onSubmit,
  lyanRating,
  nastyaRating,
  setLyanRating,
  setNastyaRating,
  isLoading,
  preview,
  isSeries,
  contentType
}: FormContainerProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <PersonalRatingsSection
          lyanRating={lyanRating}
          nastyaRating={nastyaRating}
          setLyanRating={setLyanRating}
          setNastyaRating={setNastyaRating}
        />
        
        <StreamingLinkSection register={register} />
        
        <CommentsSection register={register} />
        
        <SubmitButtonSection
          isLoading={isLoading}
          preview={preview}
          isSeries={isSeries}
          contentType={contentType}
        />
      </div>
    </form>
  );
};

export default FormContainer;
