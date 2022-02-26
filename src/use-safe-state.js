import { useState } from 'react';
import { useIsMounted } from './use-is-mounted';

export function useSafeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const isMounted = useIsMounted();

  const updateState = useCallback(
    newValue => {
      if (isMounted.current) {
        setState(newValue);
      }
    },
    [isMounted]
  );

  return [state, updateState];
}
