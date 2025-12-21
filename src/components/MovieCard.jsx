const MovieCard = ({ movie }) => {
  return (
    <div className="group relative w-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300">
      
      {/* 1. Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img 
          src={movie.image} 
          alt={movie.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Optional: Dark gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Yellow Bottom Bar (The Signature Look) */}
      <div className="bg-brand-gold w-full py-2 px-3 flex items-center justify-center text-center h-14 relative z-10">
        <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
          {movie.title}
        </h3>
      </div>
      
    </div>
  );
};

export default MovieCard;