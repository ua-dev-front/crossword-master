import { useEffect, useRef } from 'react';

export default function usePreviousValue<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
