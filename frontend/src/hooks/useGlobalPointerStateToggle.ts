import { useCallback, useEffect, useRef } from 'react';

const useGlobalPointerStateToggle = (
  callback: (event: Event, isDownEvent: boolean) => void,
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handlePointerDown = useCallback(
    (event: Event) => callbackRef.current(event, true),
    [callbackRef],
  );
  const handlePointerUp = useCallback(
    (event: Event) => callbackRef.current(event, false),
    [callbackRef],
  );

  useEffect(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerUp]);
};

export default useGlobalPointerStateToggle;
