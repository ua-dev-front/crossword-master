import { useEffect } from 'react';

const EVENTS = {
  pointerDown: 'pointerdown',
  pointerUp: 'pointerup',
};

const useGlobalPointerClickToggle = (
  callback: (event: Event, isDownEvent: boolean) => void,
) => {
  const documentMethodHandler = (
    method: Document['addEventListener'] | Document['removeEventListener'],
  ) => {
    Object.values(EVENTS).forEach((eventType) => {
      method(eventType, (event) =>
        callback(event, eventType === EVENTS.pointerDown),
      );
    });
  };

  useEffect(() => {
    documentMethodHandler(document.addEventListener);
    return () => documentMethodHandler(document.removeEventListener);
  }, [callback]);
};

export default useGlobalPointerClickToggle;
