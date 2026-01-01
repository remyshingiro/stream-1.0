import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 1. IMPORT SERVICES & PAGES
import { fetchAllData } from './services/githubService'; 
import AdminPanel from './components/AdminPanel';        
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WatchModal from './components/WatchModal';
import WatchPage from './pages/WatchPage';

// --- NEW IMPORTS ---
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SkeletonLoader from './components/SkeletonLoader';

function App() {
  // 2. STATE: Instead of static files, we start with an empty list
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 3. EFFECT: Load data from GitHub on startup
  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchAllData();
      setFetchedData(data);
      setIsLoading(false);
    };
    loadContent();
  }, []);

  // 4. SMART DATA MERGE: Renames duplicates (Applied to fetched data)
  const allContent = useMemo(() => {
    // If we are still loading, return empty
    if (fetchedData.length === 0) return [];

    const seenIds = new Set();
    
    return fetchedData.map((item) => {
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
  }, [fetchedData]); // Re-run this only when fetchedData changes

  // 5. HELPER: Filter for Series Page
  const seriesContent = useMemo(() => {
    return allContent.filter(item => 
      item.type === 'series' || item.category === 'Series'
    );
  }, [allContent]);

  // Loading Screen
if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0f0f] font-sans relative">
        <Toaster position="bottom-right" reverseOrder={false} />
        {/* Pass the search setter to Navbar */}
        <Navbar onSearch={setSearchTerm} />

        {/* --- PAGE CONTENT (Hidden if watching a video) --- */}
        <div className={selectedContent ? "hidden" : "block"}>
          
          <Routes>
            
            {/* Route 1: Home Page - Shows ALL content */}
            <Route 
              path="/" 
              element={
                <Home 
                  contentData={allContent} 
                  searchTerm={searchTerm} 
                  onMovieClick={setSelectedContent} 
                />
              } 
            />

            {/* Route 2: Categories/Seasons - Shows ONLY Series */}
            <Route 
              path="/seasons" 
              element={
                <Home 
                  contentData={seriesContent} 
                  searchTerm={searchTerm} 
                  onMovieClick={setSelectedContent} 
                />
              } 
            />
            <Route path="/watch/:id" element={<WatchPage allMovies={allContent} />} />

            {/* 👇 NEW Route 3: Login Page */}
            <Route path="/login" element={<Login />} />

            {/* 👇 UPDATED Route 4: Protected Admin Panel */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel movies={allContent} />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </div>

        {/* --- WATCH MODAL --- */}
        {selectedContent && (
          <WatchModal 
            content={selectedContent}
            allContent={allContent} 
            onClose={() => setSelectedContent(null)}
            onContentChange={setSelectedContent}
          />
        )}

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;