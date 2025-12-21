import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[85vh] w-full">
        {/* Background Image (Using a random movie poster from Unsplash for testing) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover" 
            alt="Hero Background"
          />
          {/* The "Cinematic Fade" Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-2xl mt-20">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              Trending Now
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              Dune: Part Two
            </h1>
            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2">
                ▶ Watch Now
              </button>
              <button className="bg-slate-800/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition">
                + Add to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DUMMY CONTENT AREA (To test scrolling) */}
      <div className="px-8 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-4">Latest Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="aspect-[2/3] bg-slate-800 rounded-xl hover:scale-105 transition duration-300 cursor-pointer border border-slate-700/50">
              {/* Card placeholder */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>

    
  );
}

export default App;