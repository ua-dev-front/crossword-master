import { useEffect, useRef } from 'react';

const useGlobalPointerStateToggle = (
  callback: (event: Event, isDownEvent: boolean) => void,
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handlePointerDown = (event: Event) =>
      callbackRef.current(event, true);
    const handlePointerUp = (event: Event) => callbackRef.current(event, false);

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);
};

export default useGlobalPointerStateToggle;
