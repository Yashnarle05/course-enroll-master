
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type Role = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock database for users (replace with Supabase integration later)
const USERS_STORAGE_KEY = 'lms_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = async (name: string, email: string, password: string, role: Role): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = getUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "User with this email already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        role,
        password, // In a real app, this would be hashed
      };
      
      // Save user to "database"
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      
      toast({
        title: "Registration successful",
        description: "You can now login with your credentials",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = getUsers();
      const userMatch = users.find(u => u.email === email && u.password === password);
      
      if (!userMatch) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = userMatch;
      
      // Update state and store in localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
