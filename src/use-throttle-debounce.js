import { useEffect, useMemo } from 'react';
import { useLatest } from './use-latest';

function makeDebouncedHook(debounceFn) {
  return function useDebounce(cb, ms) {
    const latestCb = useLatest(cb);

    const debouncedFn = useMemo(
      () =>
        debounceFn((...args) => {
          latestCb.current(...args);
        }, ms),
      [ms, latestCb]
    );

    useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);

    return debouncedFn;
  };
}

export const useDebounce = makeDebouncedHook(debounce);
export const useThrottle = makeDebouncedHook(throttle);
