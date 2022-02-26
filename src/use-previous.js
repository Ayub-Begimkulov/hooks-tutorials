import { useEffect, useRef } from 'react';

export function usePrevious(value) {
  const prevValueRef = useRef(null);

  useEffect(() => {
    prevValueRef.current = value;
  });

  return prevValueRef;
}
