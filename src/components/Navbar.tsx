
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FileText, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-card shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <img 
                  src="/lovable-uploads/fffb5131-f0b0-445a-939d-341d385e0ce8.png" 
                  alt="D.M.S Logo" 
                  className="h-8 w-8 mr-2" 
                />
                <span className="font-bold text-xl text-primary">D.M.S Fee Management</span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/dashboard" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/students" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Link>
            <Link 
              to="/fees" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
            >
              <FileText className="mr-2 h-4 w-4" />
              Fees
            </Link>
            <div className="flex items-center border-l border-border pl-3 ml-2">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                <Moon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <button 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => console.log("Logout clicked")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <div className="flex items-center mr-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-blue-600 ml-1" />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-accent"
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
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/students"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Link>
            <Link
              to="/fees"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Fees
            </Link>
            <button
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
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
