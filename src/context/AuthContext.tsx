import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  setDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUser && savedRole) {
      setCurrentUser(JSON.parse(savedUser));
      setRole(savedRole as UserRole);
    }
  }, []);

  const login = (email: string, password: string, selectedRole: UserRole): boolean => {
    // Find user with matching email and role
    const user = users.find(u => u.email === email && u.role === selectedRole);
    
    if (user && user.password === password) {
      setCurrentUser(user);
      setRole(user.role);
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (currentUser) {
      const updatedCurrentUser = { ...currentUser, ...updatedUser };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  };

  // For demo purposes only - allows setting role without login
  const setDemoRole = (selectedRole: UserRole) => {
    const demoUser = users.find(u => u.role === selectedRole);
    if (demoUser) {
      setCurrentUser(demoUser);
      setRole(demoUser.role);
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      localStorage.setItem('userRole', demoUser.role);
    }
  };

  const value = {
    currentUser,
    role,
    login,
    logout,
    updateUserProfile,
    setDemoRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};