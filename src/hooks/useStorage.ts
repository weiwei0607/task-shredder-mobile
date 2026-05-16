import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((item) => {
      if (item !== null) {
        try {
          setStoredValue(JSON.parse(item));
        } catch {
          setStoredValue(initialValue);
        }
      }
      setIsReady(true);
    });
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      AsyncStorage.setItem(key, JSON.stringify(valueToStore)).catch(err => {
        console.warn(`[useStorage] Failed to persist "${key}":`, err);
      });
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue, isReady];
}
