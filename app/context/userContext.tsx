'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type UserContextType = {
  user: UserType | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user'); // your API
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook (important)
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
}
