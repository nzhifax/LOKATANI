import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const USER_KEY = '@lokatani:user';
const USERS_KEY = '@lokatani:users';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'farmer' | 'buyer';
  photo?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    userType: 'farmer' | 'buyer'
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    userType: 'farmer' | 'buyer'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        fullName,
        phone,
        userType,
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      users.push({ ...newUser, password });
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Set as current user
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Get users from storage
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      // Find user
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Remove password before setting user
      const { password: _, ...userWithoutPassword } = foundUser;
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Update in users list
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};