import { useState, useMemo } from 'react';
import { staticMovies } from './data/staticMovies'; 
import { staticSeries } from './data/staticSeries'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WatchModal from './components/WatchModal';

function App() {
  // 1. SMART DATA MERGE: Renames duplicates instead of deleting them
  const allContent = useMemo(() => {
    // Combine raw lists
    const rawList = [...staticMovies, ...staticSeries];
    
    const seenIds = new Set();
    
    return rawList.map((item) => {
      let uniqueId = item.id;
      let counter = 1;

      // While this ID already exists in our set, keep adding a number to it
      while (seenIds.has(uniqueId)) {
        const newId = `${item.id}_copy${counter}`;
        // Log the fix so you know it happened
        console.log(`🔧 Fixed Duplicate: Renamed '${uniqueId}' to '${newId}'`);
        uniqueId = newId;
        counter++;
      }

      // Mark this new ID as "seen"
      seenIds.add(uniqueId);

      // Return the item with the SAFE, UNIQUE ID
      return { ...item, id: uniqueId };
    });
  }, []);

  // 2. State Management
  const [selectedContent, setSelectedContent] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative">
      <Navbar onSearch={setSearchTerm} />

      {/* --- PAGE CONTENT --- */}
      <div className={selectedContent ? "hidden" : "block"}>
        <Home 
          contentData={allContent} 
          searchTerm={searchTerm} 
          onMovieClick={(item) => setSelectedContent(item)} 
        />
      </div>

      {/* --- WATCH MODAL --- */}
      {selectedContent && (
        <WatchModal 
          content={selectedContent}
          allContent={allContent} 
          onClose={() => setSelectedContent(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;