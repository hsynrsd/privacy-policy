import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export function useAutosave<T>(
  key: string,
  data: T,
  delay: number = 1000
): { lastSaved: Date | null; clearSaved: () => void } {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveToStorage = debounce((data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, delay);

  useEffect(() => {
    saveToStorage(data);
  }, [data, saveToStorage]);

  const clearSaved = () => {
    try {
      localStorage.removeItem(key);
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return { lastSaved, clearSaved };
}

export function getSavedData<T>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
} 