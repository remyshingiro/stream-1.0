import { useState } from 'react';

const Navbar = () => {
  return (
    <nav className="bg-brand-dark/95 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {/* You can replace this icon with your real logo image later */}
            <div className="w-10 h-10 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-600 font-bold text-xl">▶</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brand-gold font-bold text-xl leading-none">Agasobanuye</span>
              <span className="text-white text-xs tracking-widest">FILMS</span>
            </div>
          </div>

          {/* 2. Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-brand-gold transition">Ahabanza</a>
            <a href="#" className="hover:text-brand-gold transition">TV Series</a>
            <a href="#" className="hover:text-brand-gold transition">Categories</a>
            <a href="#" className="hover:text-brand-gold transition">Film zose</a>
            <a href="#" className="hover:text-brand-gold transition">FAQs</a>
          </div>

          {/* 3. Right Side: Button & Search */}
          <div className="flex items-center gap-3">
            <button className="bg-brand-gold hover:bg-yellow-500 text-black font-bold px-5 py-2 rounded-sm text-sm transition">
              Injira
            </button>
            
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Shakisha filme..." 
                className="bg-white text-black pl-3 pr-10 py-2 rounded-sm text-sm focus:outline-none w-48 focus:w-64 transition-all"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-brand-gold text-black rounded-r-sm hover:bg-yellow-500">
                🔍
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;