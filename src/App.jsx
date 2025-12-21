import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 1. Import Router components
import { staticMovies } from './data/staticMovies'; 
import { staticSeries } from './data/staticSeries'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WatchModal from './components/WatchModal';

function App() {
  // 1. SMART DATA MERGE: Renames duplicates instead of deleting them
  const allContent = useMemo(() => {
    const rawList = [...staticMovies, ...staticSeries];
    const seenIds = new Set();
    
    return rawList.map((item) => {
      let uniqueId = item.id;
      let counter = 1;

      while (seenIds.has(uniqueId)) {
        const newId = `${item.id}_copy${counter}`;
        console.log(`🔧 Fixed Duplicate: Renamed '${uniqueId}' to '${newId}'`);
        uniqueId = newId;
        counter++;
      }

      seenIds.add(uniqueId);
      return { ...item, id: uniqueId };
    });
  }, []);

  // 2. State Management
  const [selectedContent, setSelectedContent] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  return (
    // 3. Wrap everything in BrowserRouter
    <BrowserRouter>
      <div className="min-h-screen bg-brand-dark font-sans relative">
        <Navbar onSearch={setSearchTerm} />

        {/* --- PAGE CONTENT (Hidden if watching a video) --- */}
        <div className={selectedContent ? "hidden" : "block"}>
          
          {/* 4. Define Your Routes Here */}
          <Routes>
            
            {/* Route 1: Home Page - Shows ALL content (Movies + Series) */}
            <Route 
              path="/" 
              element={
                <Home 
                  contentData={allContent} 
                  searchTerm={searchTerm} 
                  onMovieClick={(item) => setSelectedContent(item)} 
                />
              } 
            />

            {/* Route 2: Categories/Seasons - Reuses Home but ONLY shows staticSeries */}
            <Route 
              path="/seasons" 
              element={
                <Home 
                  contentData={staticSeries} // <--- Only passing series data here
                  searchTerm={searchTerm} 
                  onMovieClick={(item) => setSelectedContent(item)} 
                />
              } 
            />

            {/* You can add more routes here later (e.g. path="/movies") */}

          </Routes>
        </div>

        {/* --- WATCH MODAL (Outside Routes so it overlays everything) --- */}
        {selectedContent && (
          <WatchModal 
            content={selectedContent}
            allContent={allContent} 
            onClose={() => setSelectedContent(null)}
          />
        )}

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;