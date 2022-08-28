import { useEffect, useRef } from 'react';

const usePreviousValue = <Value>(value: Value): Value => {
  const ref = useRef<Value>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousValue;
