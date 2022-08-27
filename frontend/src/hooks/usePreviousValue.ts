import { useEffect, useRef } from 'react';

const usePreviousValue = (value: unknown) => {
  const ref = useRef<unknown>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousValue;
