import { useEffect } from 'react';

const useGlobalPointerStateToggle = (
  callback: (event: Event, isDownEvent: boolean) => void,
) => {
  useEffect(() => {
    document.addEventListener('pointerdown', (event) => callback(event, true));
    document.addEventListener('pointerup', (event) => callback(event, false));
    return () => {
      document.removeEventListener('pointerdown', (event) =>
        callback(event, true),
      );
      document.removeEventListener('pointerup', (event) =>
        callback(event, false),
      );
    };
  }, [callback]);
};

export default useGlobalPointerStateToggle;
