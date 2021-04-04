import { useRef, useEffect } from "react";

export function useInterval(callback, delay, dependeicies) {
  if (!dependeicies) {
    dependeicies = [];
  }
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    // Call method immediately
    savedCallback.current();
    return () => clearInterval(id);
  }, [delay, ...dependeicies]);
}
