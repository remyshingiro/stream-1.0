import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';

const Home = ({ contentData, onMovieClick, searchTerm }) => {
  
  // Filter logic
  const filteredContent = contentData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Only show Hero if not searching */}
      {!searchTerm && <Hero />}

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20 relative z-10 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-brand-gold pl-3">
          {searchTerm ? `Search Results: "${searchTerm}"` : "Filime nshya & Series"}
        </h2>

        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {filteredContent.map((item) => (
              <div key={item.id} onClick={() => onMovieClick(item)}>
                {/* Mapping your data fields to the generic MovieCard props */}
                <MovieCard movie={{
                  title: item.title,
                  image: item.poster_url, 
                  category: item.type === 'series' ? 'Series' : 'Movie',
                  year: '2025' 
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">No movies found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;