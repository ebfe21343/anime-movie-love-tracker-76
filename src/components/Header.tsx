
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        scrolled 
          ? "bg-white/70 backdrop-blur-lg shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-sakura-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300">
            <Film className="text-white h-5 w-5" />
          </div>
        </Link>
        
        {/* Title in the center */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group absolute left-1/2 transform -translate-x-1/2"
        >
          <h1 className="text-2xl font-bold text-sakura-700">
            <span className="text-lavender-700">Lyan & Nastya </span>
            <span className="text-sakura-500">MovieTracker</span>
          </h1>
          <div className="hidden md:flex">
            <Heart className="w-4 h-4 text-sakura-500 animate-pulse-gentle" />
          </div>
        </Link>
        
        {/* Add Movie button on the right */}
        <div className="flex gap-2">          
          <Button 
            variant="default" 
            size="sm" 
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-sakura-500 hover:bg-sakura-600"
            asChild
          >
            <Link to="/add">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="hidden md:flex items-center gap-2 bg-sakura-500 hover:bg-sakura-600 btn-anime"
            asChild
          >
            <Link to="/add">
              <Plus className="h-4 w-4" />
              <span>Add Movie</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
