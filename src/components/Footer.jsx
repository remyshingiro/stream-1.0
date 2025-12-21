const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Movies</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-brand-gold">Romantic</a></li>
            <li><a href="#" className="hover:text-brand-gold">Action</a></li>
            <li><a href="#" className="hover:text-brand-gold">Cartoon</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-brand-gold">Company</a></li>
            <li><a href="#" className="hover:text-brand-gold">Team</a></li>
            <li><a href="#" className="hover:text-brand-gold">Legacy</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Services</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-brand-gold">Movies</a></li>
            <li><a href="#" className="hover:text-brand-gold">Series</a></li>
            <li><a href="#" className="hover:text-brand-gold">Kids/cartoon</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12 text-xs text-gray-600">
        ©2025 VONSUNG
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 p-3 rounded-full shadow-lg hover:scale-110 transition text-white font-bold">
          WA
        </button>
      </div>
    </footer>
  );
};

export default Footer;