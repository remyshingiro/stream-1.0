import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

const WatchModal = ({ content, allContent, onClose }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Initialize: If Series, pick Ep1. If Movie, do nothing.
  useEffect(() => {
    if (content.type === 'series' && content.seasons?.[0]?.episodes?.length > 0) {
      setCurrentEpisode(content.seasons[0].episodes[0]);
    }
  }, [content]);

  // Logic: Get recommendations (Random 4 items excluding current one)
  const recommendations = allContent
    .filter((item) => item.id !== content.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  // Helper: Determine which URL to play/download
  const activeVideoUrl = content.type === 'series' ? currentEpisode?.video_url : content.video_url;
  const activeDownloadUrl = content.type === 'series' ? currentEpisode?.download_url : content.download_url;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-0 md:p-4 overflow-y-auto">
      
      {/* Header */}
      <div className="w-full max-w-7xl flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur mb-2 rounded-t-lg">
        <div>
          <h2 className="text-brand-gold text-lg md:text-2xl font-bold uppercase">
            {content.title}
          </h2>
          {content.type === 'series' && currentEpisode && (
            <p className="text-gray-400 text-sm">
              Watching: <span className="text-white">{currentEpisode.title}</span>
            </p>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition"
        >
          ✕ Close
        </button>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 h-full lg:h-[80vh]">
        
        {/* LEFT SIDE: THE PLAYER */}
        <div className="flex-1 flex flex-col">
          <div className="w-full h-full min-h-[300px] bg-black shadow-2xl border border-gray-800 relative rounded-lg overflow-hidden">
            <iframe 
              key={activeVideoUrl} // Force reload when url changes
              src={activeVideoUrl} 
              className="w-full h-full absolute inset-0" 
              frameBorder="0" 
              allowFullScreen
              title="Video Player"
            ></iframe>
          </div>
          
          <div className="mt-4 flex justify-between items-center px-2">
            <div className="text-gray-400 text-sm hidden md:block">{content.description}</div>
            <a 
              href={activeDownloadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-sm flex items-center gap-2 transition"
            >
              ⬇ Download
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: SIDEBAR (Changes based on Type) */}
        <div className="w-full lg:w-96 bg-gray-900 rounded-lg border border-gray-700 flex flex-col h-[500px] lg:h-auto">
          
          {/* SCENARIO 1: SERIES - Show Episode List */}
          {content.type === 'series' ? (
            <>
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <h3 className="text-white font-bold">Episodes</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {content.seasons.map((season) => (
                  <div key={season.seasonNumber}>
                    {content.seasons.length > 1 && (
                      <div className="text-brand-gold text-xs font-bold uppercase mt-2 mb-1 px-2">
                        Season {season.seasonNumber}
                      </div>
                    )}
                    {season.episodes.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => setCurrentEpisode(ep)}
                        className={`w-full text-left p-3 rounded transition flex items-center gap-3 text-sm ${
                          currentEpisode?.id === ep.id 
                            ? 'bg-brand-gold text-black font-bold' 
                            : 'bg-black/40 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <span>▶</span>
                        <span className="line-clamp-1">{ep.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            
            /* SCENARIO 2: MOVIE - Show Recommendations */
            <>
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <h3 className="text-white font-bold">You might also like</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-3 grid grid-cols-2 gap-3 content-start">
                {recommendations.map((rec) => (
                  // Use a simplified version of MovieCard or just the image
                  <div 
                    key={rec.id} 
                    className="relative cursor-pointer group"
                    // Note: In a real app, you might want clicking this to switch the modal content
                    // For now, we assume simple display
                  >
                    <img src={rec.poster_url} className="rounded-md opacity-80 group-hover:opacity-100 transition" />
                    <p className="text-xs text-center mt-1 text-gray-400 group-hover:text-brand-gold">{rec.title}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchModal;