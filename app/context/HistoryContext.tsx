"use client";

import { FeiningerData } from '@/lib/feininger';
import { createContext, useContext, useState, ReactNode } from 'react';

interface HistoryContextType {
  history: FeiningerData[];
  addToHistory: (item: FeiningerData) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<FeiningerData[]>([]);

  const addToHistory = (item: FeiningerData) => {
    // Avoid adding duplicates if the same item is somehow generated again
    if (!history.find(h => h.seed === item.seed && h.version === item.version)) {
      setHistory(prevHistory => [...prevHistory, item]);
    }
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
