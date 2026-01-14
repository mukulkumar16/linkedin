"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

/* ---------- TYPES ---------- */
type UnreadMap = Record<string, number>;

interface UnreadContextType {
  unread: UnreadMap;
  addUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
  totalUnread: number;
}

/* ---------- CONTEXT ---------- */
const UnreadContext = createContext<UnreadContextType | undefined>(
  undefined
);

/* ---------- PROVIDER ---------- */
export function UnreadProvider({ children }: { children: ReactNode }) {
  const [unread, setUnread] = useState<UnreadMap>({});

  const addUnread = (conversationId: string) => {
    if (!conversationId) return;

    setUnread((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] ?? 0) + 1,
    }));
  };

  const clearUnread = (conversationId: string) => {
    if (!conversationId) return;

    setUnread((prev) => {
      if (!prev[conversationId]) return prev;

      const copy = { ...prev };
      delete copy[conversationId];
      return copy;
    });
  };

  const totalUnread = useMemo(() => {
    return Object.values(unread).reduce((a, b) => a + b, 0);
  }, [unread]);

  return (
    <UnreadContext.Provider
      value={{ unread, addUnread, clearUnread, totalUnread }}
    >
      {children}
    </UnreadContext.Provider>
  );
}

/* ---------- HOOK ---------- */
export function useUnread() {
  const context = useContext(UnreadContext);

  if (!context) {
    throw new Error("useUnread must be used inside UnreadProvider");
  }

  return context;
}
