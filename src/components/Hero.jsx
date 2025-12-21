const Hero = () => {
  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
          className="h-full w-full object-cover" 
          alt="Hero Background"
        />
        {/* Gradient Overlay - using brand-dark for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mt-20">
          
          {/* Tag - Updated to Gold */}
          <span className="bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block">
            Trending Now
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight text-white">
            Dune: Part Two
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 line-clamp-3">
            Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
          </p>
          
          {/* Buttons - Updated to Match Theme */}
          <div className="flex gap-4">
            <button className="bg-brand-gold text-black px-8 py-3 rounded-sm font-bold hover:bg-yellow-500 transition flex items-center gap-2">
              ▶ Watch Now
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-sm font-bold hover:bg-white/20 transition">
              + Add to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;