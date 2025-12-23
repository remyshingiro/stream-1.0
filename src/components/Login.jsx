import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Make sure VITE_ADMIN_PASSWORD is set in your .env file
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      localStorage.setItem('admin_token', 'true');
      navigate('/admin');
    } else {
      alert("❌ Access Denied: Wrong Password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">Admin Access</h2>
        <input 
          type="password" 
          placeholder="Enter Admin Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-lg p-3 mb-4 text-white focus:border-red-600 outline-none transition-colors"
        />
        <button type="submit" className="w-full bg-red-600 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
          Unlock Dashboard
        </button>
      </form>
    </div>
  );
};

export default Login;