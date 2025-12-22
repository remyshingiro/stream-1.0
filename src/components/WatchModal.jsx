import { useState, useEffect } from 'react';

const WatchModal = ({ content, allContent, onClose, onContentChange }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Initialize Series
  useEffect(() => {
    if (content.type === 'series' && content.seasons?.[0]?.episodes?.length > 0) {
      setCurrentEpisode(content.seasons[0].episodes[0]);
    } else {
      setCurrentEpisode(null);
    }
  }, [content]);

  // Logic: Recommendations
  const recommendations = allContent
    .filter((item) => item.id !== content.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  // Helper: Get Download Link
  const getDownloadLink = (item) => {
    if (!item) return null;
    return item.download_url || item.downloadUrl || item.link || item.url || item.file || null;
  };

  const activeVideoUrl = content.type === 'series' 
    ? (currentEpisode?.video_url || currentEpisode?.videoUrl) 
    : (content.video_url || content.videoUrl);

  const activeDownloadUrl = content.type === 'series' 
    ? getDownloadLink(currentEpisode)
    : getDownloadLink(content);

  const activeTitle = content.type === 'series' && currentEpisode 
    ? `S${content.seasons.findIndex(s => s.episodes.includes(currentEpisode)) + 1}:E${currentEpisode.id.split('_').pop() || '1'}`
    : "Movie";

  return (
    // OUTER WRAPPER
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-4">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl h-full md:h-[90vh] bg-[#121212] md:rounded-xl shadow-2xl flex flex-col overflow-hidden border-none md:border border-white/10">
        
        {/* --- 1. HEADER --- */}
        <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-white/10 z-20">
          <div className="flex flex-col overflow-hidden">
             <h2 className="text-white text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-md">
                {content.title}
             </h2>
             <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">
               {activeTitle}
             </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={activeDownloadUrl || "#"} 
              target={activeDownloadUrl ? "_blank" : "_self"}
              onClick={(e) => !activeDownloadUrl && e.preventDefault()} 
              className={`
                flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-xs md:text-sm transition-all
                ${activeDownloadUrl 
                  ? "bg-white text-black hover:bg-brand-gold" 
                  : "bg-gray-800 text-gray-500 cursor-not-allowed" 
                }
              `}
            >
               <span className="hidden sm:inline">{activeDownloadUrl ? "Download" : "No Link"}</span>
               <span className="sm:hidden">{activeDownloadUrl ? "⬇" : "🚫"}</span>
            </a>

            <button 
              onClick={onClose} 
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* --- 2. BODY CONTENT --- */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT SIDE: VIDEO PLAYER */}
          <div className="w-full md:flex-1 flex flex-col bg-black md:overflow-y-auto shrink-0">
            
            {/* VIDEO CONTAINER:
               - Mobile: h-[65vh] (65% screen height)
               - Medium (Tablet): md:flex-1 (Fills remaining height - THEATER MODE)
               - Large (Desktop): lg:flex-none lg:aspect-video (Returns to 16:9 to fit description)
            */}
            <div className="w-full h-[65vh] md:h-auto md:flex-1 lg:flex-none lg:aspect-video bg-black flex items-center justify-center flex-shrink-0">
               {activeVideoUrl ? (
                <iframe 
                  src={activeVideoUrl} 
                  className="w-full h-full" 
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Video Unavailable</div>
              )}
            </div>
            
            {/* DESCRIPTION: Visible ONLY on Large Screens (Desktop) */}
            <div className="hidden lg:block p-6">
              <h3 className="text-white font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {content.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: SIDEBAR LIST */}
          <div className="flex-1 md:flex-none w-full md:w-80 bg-[#181818] md:border-l border-white/5 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-gray-900/50 flex-shrink-0">
               <h3 className="text-gray-400 text-xs font-bold uppercase">
                 {content.type === 'series' ? 'Up Next' : 'Related'}
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
               {content.type === 'series' ? (
                 content.seasons?.map(season => (
                   <div key={season.seasonNumber}>
                     {season.episodes.map(ep => (
                       <button 
                         key={ep.id} 
                         onClick={() => setCurrentEpisode(ep)}
                         className={`w-full text-left p-3 rounded text-sm truncate transition-colors ${
                           currentEpisode?.id === ep.id 
                             ? 'bg-brand-gold text-black font-bold' 
                             : 'bg-[#222] text-gray-300 hover:bg-white/10'
                         }`}
                       >
                         {ep.title}
                       </button>
                     ))}
                   </div>
                 ))
               ) : (
                 recommendations.map(rec => (
                   <div 
                     key={rec.id} 
                     onClick={() => onContentChange && onContentChange(rec)}
                     className="flex gap-3 p-2 hover:bg-white/10 rounded cursor-pointer transition-colors bg-[#222] md:bg-transparent"
                   >
                     <img 
                       src={rec.poster_url || rec.image} 
                       className="w-16 h-24 object-cover rounded shadow-md flex-shrink-0" 
                       alt={rec.title}
                     />
                     <div className="flex flex-col justify-center min-w-0">
                       <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-snug">{rec.title}</p>
                       <p className="text-xs text-brand-gold mt-1">Watch Now ▶</p>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchModal;