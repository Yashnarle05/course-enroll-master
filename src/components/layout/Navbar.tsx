
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          LearnHub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/courses" className="text-gray-700 hover:text-primary transition-colors">
            Courses
          </Link>
          {user && (
            <Link to="/my-learning" className="text-gray-700 hover:text-primary transition-colors">
              My Learning
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-primary transition-colors">
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-primary text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-gray-700 hover:text-primary py-2 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/courses"
                onClick={closeMenu}
                className="text-gray-700 hover:text-primary py-2 transition-colors"
              >
                Courses
              </Link>
              {user && (
                <Link
                  to="/my-learning"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                >
                  My Learning
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              
              {!user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <div className="flex items-center space-x-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
