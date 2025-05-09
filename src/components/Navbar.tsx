
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FileText, 
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="font-bold text-xl text-primary">
                SchoolFee
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/dashboard" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/students" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Link>
            <Link 
              to="/fees" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Fees
            </Link>
            <button 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50"
              onClick={() => console.log("Logout clicked")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/students"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Link>
            <Link
              to="/fees"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Fees
            </Link>
            <button
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50"
              onClick={() => {
                console.log("Logout clicked");
                setIsOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
