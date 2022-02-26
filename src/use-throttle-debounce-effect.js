import { useEffect, useRef } from 'react';
import { useDebounce, useThrottle } from './use-throttle-debounce';

function makeDebounceEffectHook(useDebounceHook) {
  return function (cb, deps, ms) {
    const isInitialRender = useRef(true);
    const cleanUpFn = useRef();

    const debouncedCb = useDebounceHook(() => {
      cleanUpFn.current = cb();
    }, ms);

    useEffect(() => {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      debouncedCb();

      return () => {
        if (typeof cleanUpFn.current === 'function') {
          cleanUpFn.current();
          cleanUpFn.current = undefined;
        }
      };
    }, [debouncedCb, ...deps]);
  };
}

export const useDebounceEffect = makeDebounceEffectHook(useDebounce);
export const useThrottleEffect = makeDebounceEffectHook(useThrottle);
