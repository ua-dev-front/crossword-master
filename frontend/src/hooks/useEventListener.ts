import { useEffect, useRef } from 'react';

const useEventListener = (
  eventName: 'pointerdown' | 'pointerup' | 'transitionstart' | 'transitionend',
  callback: (event: Event) => void,
  element: HTMLElement | Document | null = document,
) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!element) {
      return;
    }

    const handleEvent = (event: Event) => callbackRef.current(event);
    element.addEventListener(eventName, handleEvent);
    return () => element.removeEventListener(eventName, handleEvent);
  }, [element]);
};

export default useEventListener;
