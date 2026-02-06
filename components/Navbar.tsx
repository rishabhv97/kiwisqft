
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, UserCircle, Search, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            <Link to="/admin" className="text-gray-600 hover:text-brand-green font-medium flex items-center gap-1">
                <ShieldCheck size={16} /> Admin
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
             <Link to="/sell" className="flex items-center gap-2 group relative">
                <div className="bg-brand-brown/10 text-brand-brown px-3 py-1.5 rounded-full text-xs font-bold border border-brand-brown/20 group-hover:bg-brand-brown group-hover:text-white transition-all whitespace-nowrap">
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full animate-bounce">FREE</span>
                  Post Property
                </div>
             </Link>
             
             <Link to="/settings" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-brand-green text-white shadow-lg shadow-brand-green/30 hover:scale-105 transition-transform">
                <UserCircle size={20} />
             </Link>

             {/* Mobile Menu Button */}
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-green"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link 
              to="/buy" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700"
            >
              Buy
            </Link>
            <Link 
              to="/rent" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700"
            >
              Rent
            </Link>
            <Link 
              to="/sell" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700"
            >
              Sell
            </Link>
            <Link 
              to="/find-agent" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700"
            >
              Find An Agent
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700 flex items-center gap-2"
            >
              <ShieldCheck size={18} /> Admin Panel
            </Link>
            <Link 
              to="/settings" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-gray-50 text-base font-medium text-gray-700"
            >
              Settings & Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
