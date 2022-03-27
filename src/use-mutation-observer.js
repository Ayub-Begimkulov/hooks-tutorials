import { useState, useEffect } from 'react';
import { useLatest } from './use-latest';
import { useCombinedRef } from './use-combined-ref';

export function useMutationObserver(cb, options) {
  const [element, setElement] = useState(null);
  const latestCb = useLatest(cb);

  useEffect(() => {
    if (!element) return;

    const observer = new MutationObserver((...args) => {
      latestCb.current(...args);
    });

    observer.observe(element, options);

    return () => observer.disconnect();
  }, [element, latestCb, options]);

  return setElement;
}

export function MutationObserverComponent({
  children,
  onMutation,
  options,
  nodeRef,
}) {
  const mutationRef = useMutationObserver(onMutation, options);

  const combinedRef = useCombinedRef(nodeRef, mutationRef);

  return children(combinedRef);
}
