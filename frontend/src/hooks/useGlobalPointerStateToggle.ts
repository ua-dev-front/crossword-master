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
    const pointerDownListener = (event: Event) => handlePointerDown(event);
    const pointerUpListener = (event: Event) => handlePointerUp(event);

    document.addEventListener('pointerdown', pointerDownListener);
    document.addEventListener('pointerup', pointerUpListener);
    return () => {
      document.removeEventListener('pointerdown', pointerDownListener);
      document.removeEventListener('pointerup', pointerUpListener);
    };
  }, [handlePointerDown, handlePointerUp]);
};

export default useGlobalPointerStateToggle;
