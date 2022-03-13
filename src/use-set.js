function useSet(values) {
  const [count, increment] = useReducer(v => v + 1, 0);
  const set = useMemo(() => new Set(values), []);

  const add = useCallback(
    value => {
      set.add(value);
      increment();
    },
    [set]
  );

  const clear = useCallback(() => {
    set.clear();
    increment();
  }, [set]);

  const remove = useCallback(
    value => {
      set.delete(value);
      increment();
    },
    [set]
  );

  const forEach = useCallback(
    callback => {
      set.forEach(callback);
    },
    [set]
  );

  const has = useCallback(
    value => {
      return set.has(value);
    },
    [set]
  );

  const size = useCallback(() => {
    return set.size;
  }, [set]);

  const resultSet = useMemo(() => {
    return {
      add,
      has,
      delete: remove,
      clear,
      forEach,
      get size() {
        return size();
      },
      __version__: count,
    };
  }, [count]);

  return resultSet;
}
