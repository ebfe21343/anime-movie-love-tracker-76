
import Header from '@/components/Header';
import AddMovieForm from '@/components/AddMovieForm';

const AddMovie = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 pt-28">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-sakura-700 mb-2">
            Add New Movie
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter an IMDb ID to add a new movie to your collection
          </p>
        </div>
        
        <AddMovieForm />
      </main>
    </div>
  );
};

export default AddMovie;
