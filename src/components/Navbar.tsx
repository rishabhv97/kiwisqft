import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, X, UserCircle, Search, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import this!

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth(); // Get real user state
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 group">
            <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Home size={18} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-extrabold text-brand-green tracking-tight">Kiwi <span className="text-brand-brown">Sqft</span></span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/buy" className="text-gray-600 hover:text-brand-green font-medium">Buy</Link>
            <Link to="/rent" className="text-gray-600 hover:text-brand-green font-medium">Rent</Link>
            <Link to="/sell" className="text-gray-600 hover:text-brand-green font-medium">Sell</Link>
            <Link to="/find-agent" className="text-gray-600 hover:text-brand-green font-medium">Find An Agent</Link>
            
            {/* Only show Admin link if user is Admin */}
            {user?.role === 'Admin' && (
              <Link to="/admin" className="text-brand-green font-bold flex items-center gap-1">
                  <ShieldCheck size={16} /> Admin
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
             {/* Show Login/Signup if NOT logged in */}
             {!user ? (
               <Link to="/login" className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-800 transition">
                 Login
               </Link>
             ) : (
               <>
                 <Link to="/sell" className="hidden sm:flex items-center gap-2 group relative">
                    <div className="bg-brand-brown/10 text-brand-brown px-3 py-1.5 rounded-full text-xs font-bold border border-brand-brown/20 group-hover:bg-brand-brown group-hover:text-white transition-all whitespace-nowrap">
                      Post Property
                    </div>
                 </Link>
                 
                 <div className="flex items-center gap-2">
                   <Link to="/settings" className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-green text-white hover:scale-105 transition-transform" title={user.name}>
                      <UserCircle size={20} />
                   </Link>
                   <button onClick={handleSignOut} className="text-gray-500 hover:text-red-500" title="Sign Out">
                      <LogOut size={20} />
                   </button>
                 </div>
               </>
             )}

             {/* Mobile Menu Button */}
             <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 hover:text-brand-green">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu (Simplified for brevity, ensure you copy structure from your original file if needed) */}
      {isOpen && (
         <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg p-4">
            {/* Add mobile links here matching desktop logic */}
            {!user && <Link to="/login" className="block py-2 text-brand-green font-bold">Login / Signup</Link>}
            {user && <button onClick={handleSignOut} className="block py-2 text-red-500 font-bold">Sign Out</button>}
         </div>
      )}
    </nav>
  );
};

export default Navbar;