
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'admin' | 'employee' | 'customer';

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for simulation
const users = {
    "donato@gmail.com": { id: "1", username: "Donato", password: "Donay20", role: "admin" as Role },
    "empleado@test.com": { id: "2", username: "EmpleadoUno", password: "password123", role: "employee" as Role },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string, username?: string): Promise<void> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Admin and Employee login
            const predefinedUser = (users as any)[email];
            if (predefinedUser && predefinedUser.password === password) {
                const userData = {
                    id: predefinedUser.id,
                    username: predefinedUser.username,
                    email,
                    role: predefinedUser.role,
                };
                setUser(userData);
                setLoading(false);
                resolve();
                return;
            }

            // Customer registration/login simulation
            if (username) { // Registration
                const newCustomer: User = {
                    id: String(Date.now()),
                    username,
                    email,
                    role: 'customer'
                };
                setUser(newCustomer);
                setLoading(false);
                resolve();
                return;
            }

            // Customer login (if they are not predefined)
            // In a real app, you would check the database. Here we simulate that any other login is a customer.
            // For this simulation, we will reject unknown logins.
            if (!predefinedUser) {
                 setLoading(false);
                 reject(new Error("Credenciales incorrectas. Por favor, inténtalo de nuevo."));
                 return;
            }


        }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    router.push('/auth');
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
