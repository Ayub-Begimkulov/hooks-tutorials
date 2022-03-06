import { useRef } from 'react';

function areDepsEqual(prevDeps, currentDeps) {
  if (prevDeps.length !== currentDeps.length) {
    return false;
  }

  for (let i = 0, l = prevDeps.length; i < l; i++) {
    if (!Object.is(prevDeps[i], currentDeps[i])) {
      return false;
    }
  }

  return true;
}

function useMemo(getResult, deps) {
  const prevDeps = useRef(null);
  const prevResult = useRef(null);

  if (prevDeps.current && areDepsEqual(prevDeps.current, deps)) {
    return prevResult.current;
  }

  const result = getResult();

  prevDeps.current = deps;
  prevResult.current = result;

  return result;
}

function useCallback(cb, deps) {
  useMemo(() => cb, [...deps]);
}
