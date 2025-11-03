import { useState, useEffect } from 'react';

function getStoredValue<T>(key: string, initialValue: T | (() => T)): T {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null) {
        try {
            return JSON.parse(savedValue);
        } 
        
        catch {
            return savedValue as T;
        }
    }

    if (initialValue instanceof Function) {
        return initialValue();
    }

    return initialValue;
    }

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        return getStoredValue(key, initialValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}