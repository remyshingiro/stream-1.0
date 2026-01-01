// const MovieCard = ({ movie }) => {
//   return (
//     <div className="group relative w-full flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300">
      
//       {/* 1. Poster Image */}
//       <div className="relative aspect-[2/3] w-full overflow-hidden">
//         {/* Support multiple image key names from your JSON */}
//         <img 
//           src={movie.poster_url || movie.image || movie.thumbnail_url} 
//           alt={movie.title} 
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//           loading="lazy" 
//         />
//         {/* Dark gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>

//       {/* 2. Yellow Bottom Bar */}
//       {/* CHANGED: 'h-14' to 'min-h-[3.5rem] h-auto' so it grows with text */}
//       <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center min-h-[3.5rem] h-auto relative z-10">
        
//         {/* Title */}
//         <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
//           {movie.title}
//         </h3>
        
//         {/* Interpreter Name */}
//         {/* We check if the name exists. If not, we don't render anything */}
//         {movie.interpreter_name && (
//           <p className="text-black/80 text-[10px] font-extrabold uppercase tracking-wide mt-1 bg-white/20 px-2 rounded-full">
//             {movie.interpreter_name}
//           </p>
//         )}

//       </div>
      
//     </div>
//   );
// };

// export default MovieCard;


const MovieCard = ({ movie }) => {
  return (
    // Removed 'cursor-pointer' (handled by Link)
    <div className="group relative w-full flex flex-col hover:shadow-2xl transition-all duration-300">
      
      {/* 1. Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img 
          src={movie.poster_url || movie.image || movie.thumbnail_url} 
          alt={movie.title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy" 
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Yellow Bottom Bar */}
      <div className="bg-brand-gold w-full py-3 px-2 flex flex-col items-center justify-center text-center min-h-[3.5rem] h-auto relative z-10">
        
        {/* Title */}
        <h3 className="text-black font-bold text-xs uppercase line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {/* Interpreter Name */}
        {movie.interpreter_name && (
          <p className="text-black/80 text-[10px] font-extrabold uppercase tracking-wide mt-1 bg-white/20 px-2 rounded-full">
            {movie.interpreter_name}
          </p>
        )}

      </div>
      
    </div>
  );
};

export default MovieCard;