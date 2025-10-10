import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const USER_KEY = '@lokatani:user';
const USERS_KEY = '@lokatani:users';

// ==============================
// 🧩 Interface Definitions
// ==============================
export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'farmer' | 'buyer';
  address?: string;
  photo?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string; 
  location?: LocationData; 
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  userType: 'farmer' | 'buyer';
  address?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  location?: LocationData;
  photo?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// ==============================
// 🧠 Context Initialization
// ==============================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user when app starts
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

  // ==============================
  // 🪪 REGISTER FUNCTION
  // ==============================
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const { email, password, fullName, phone, userType, address, gender, dob, location, photo } = data;

    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      // Cek jika email sudah ada
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return { success: false, message: 'Email sudah terdaftar' };
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        fullName,
        phone,
        userType,
        address,
        gender,
        dob,
        location,
        photo,
        createdAt: new Date().toISOString(),
      };

      // Simpan user dengan password di daftar users
      users.push({ ...newUser, password });
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Simpan user yang sedang login tanpa password
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true, message: 'Registrasi berhasil', user: newUser };
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, message: 'Registrasi gagal' };
    }
  };

  // ==============================
  // 🔐 LOGIN FUNCTION
  // ==============================
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (!foundUser) {
        return { success: false, message: 'Email atau kata sandi salah' };
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return { success: true, message: 'Login berhasil', user: userWithoutPassword };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Login gagal' };
    }
  };

  // ==============================
  // 🚪 LOGOUT FUNCTION
  // ==============================
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // ==============================
  // 🧩 UPDATE USER FUNCTION
  // ==============================
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

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

// ==============================
// 📦 Hook untuk akses konteks
// ==============================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
