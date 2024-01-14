'use client';
import { useEffect, useState } from 'react';

/**
 * Custom hook to fake a loading state.
 * @param duration The duration of the loading state in milliseconds.
 * @returns boolean indicating whether the loading state is active.
 */
export const useFakeLoading = (duration: number) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  return isLoading;
};
