import { useEffect } from 'react';

const EVENTS = ['mousedown', 'mouseup', 'touchstart', 'touchend'];

const useGlobalMouseClickToggle = (callback: (event: Event) => void) => {
  const documentMethodHandler = (
    method: Document['addEventListener'] | Document['removeEventListener'],
  ) => {
    EVENTS.forEach((event) => {
      method(event, callback);
    });
  };

  useEffect(() => {
    documentMethodHandler(document.addEventListener);
    return () => documentMethodHandler(document.removeEventListener);
  }, [callback]);
};

export default useGlobalMouseClickToggle;
