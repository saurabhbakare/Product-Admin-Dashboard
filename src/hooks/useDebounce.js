import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a rapidly changing value (e.g. search input).
 * @param {any} value - The input value to debounce.
 * @param {number} delay - Delay in milliseconds before updating the debounced value.
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if value or delay changes before the timer finishes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
