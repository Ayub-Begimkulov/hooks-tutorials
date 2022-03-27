import { useEffect, useState } from 'react';
import { useLatest } from './use-latest';

function useMutationObserver(ref, cb) {
  const latestCb = useLatest(cb);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new MutationObserver(entries => {
      if (entries[0]) {
        latestCb.current();
      }
    });

    observer.observe(element);

    return () => observer.unov;
  }, [ref, latestCb]);
}
