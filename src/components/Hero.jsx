import { useState, useEffect } from 'react';

const Hero = ({ movies = [], onPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 1. Helper: Find the correct download link (checks all possible names)
  const getDownloadLink = (item) => {
    if (!item) return null;
    return item.download_url || item.downloadUrl || item.link || item.url || item.file || null;
  };

  // Automatic Slide Logic
  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsAnimating(false);
      }, 500); // 500ms transition time matches CSS duration
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies]); 

  // If no movies exist yet, show nothing
  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  // Safety check
  if (!currentMovie) return null;

  // Get the download link for the CURRENT slide
  const downloadUrl = getDownloadLink(currentMovie);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden group">
      
      {/* BACKGROUND IMAGE */}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <img 
          src={currentMovie.poster_url || currentMovie.image} 
          className="h-full w-full object-cover transition-transform duration-[10000ms] ease-linear transform scale-100 group-hover:scale-110" 
          alt={currentMovie.title}
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className={`max-w-2xl mt-20 transition-all duration-700 transform ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          
          <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block shadow-lg">
            #{currentIndex + 1} Trending
          </span>
          
          <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight text-white drop-shadow-2xl">
            {currentMovie.title}
          </h1>
          
          <p className="text-base md:text-lg text-gray-200 mb-8 line-clamp-3 max-w-xl drop-shadow-md">
            {currentMovie.description || "Ntucikwe na filime nziza cyane zigezweho. Reba ubu nonaha kuri Agasobanuye Films."}
          </p>
          
          <div className="flex flex-wrap gap-4">
            
            {/* 1. REBA UBU (Functional) */}
            <button 
              onClick={() => onPlay(currentMovie)}
              className="bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3.5 rounded-sm font-bold transition transform hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-yellow-500/20"
            >
              <span className="text-xl">▶</span> 
              <span>REBA FILIME</span>
            </button>

            {/* 2. DOWNLOAD (Functional Link) */}
            <a 
              href={downloadUrl || "#"}
              target={downloadUrl ? "_blank" : "_self"}
              onClick={(e) => {
                if (!downloadUrl) {
                  e.preventDefault();
                  alert("Download link not available yet.");
                }
              }}
              className={`
                px-8 py-3.5 rounded-sm font-bold flex items-center gap-3 border transition-all
                ${downloadUrl 
                  ? "bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black hover:border-white" 
                  : "bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="text-xl font-bold">⬇</span> 
              <span>DOWNLOAD</span>
            </a>
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