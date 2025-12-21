import { useState, useEffect } from 'react';

// FIX 1: Add " = []" after movies to prevent the 'undefined' crash
const Hero = ({ movies = [], onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Automatic Slide Logic
  useEffect(() => {
    // Safety check: Don't start timer if no movies
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
    
    // FIX 2: Depend on the movies array itself, not length, to avoid errors
  }, [movies]); 

  // If no movies exist yet, show nothing (instead of crashing)
  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  // Extra safety: ensure currentMovie exists before trying to render
  if (!currentMovie) return null;

  return (
    <div className="relative h-[85vh] w-full overflow-hidden group">
      
      {/* BACKGROUND IMAGE */}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <img 
          src={currentMovie.poster_url} 
          className="h-full w-full object-cover" 
          alt={currentMovie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/20 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className={`max-w-2xl mt-20 transition-all duration-700 transform ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          
          <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block shadow-lg">
            #{currentIndex + 1} Trending
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-white drop-shadow-2xl">
            {currentMovie.title}
          </h1>
          
          <p className="text-lg text-gray-200 mb-8 line-clamp-3 max-w-xl drop-shadow-md">
            {currentMovie.description || "Ntucikwe na filime nziza cyane zigezweho. Reba ubu nonaha kuri Agasobanuye Films."}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onPlay(currentMovie)}
              className="bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3.5 rounded-sm font-bold transition transform hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-yellow-500/20"
            >
              <span className="text-xl">▶</span> 
              <span>REBA UBU</span>
            </button>

            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-sm font-bold hover:bg-white/20 transition flex items-center gap-3">
              <span className="text-xl">+</span> 
              <span>URUTONDE</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        {movies.slice(0, 5).map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-300 ${idx === (currentIndex % 5) ? 'w-8 bg-brand-gold' : 'w-4 bg-gray-600'}`} 
          />
        ))}
      </div>

    </div>
  );
};

export default Hero;