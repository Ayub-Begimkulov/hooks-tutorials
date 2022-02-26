import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLatest } from './use-latest';
import './styles.css';

function getSearchParam(search, param) {
  const searchParams = new URLSearchParams(search);
  return searchParams.get(param);
}

function setSearchParam(search, param, value) {
  const searchParams = new URLSearchParams(search);
  searchParams.set(param, value);
  return searchParams.toString();
}

const defaultDeserialize = v => v;
const defaultSerialize = String;

export function useSearchParamsState({
  name,
  serialize = defaultSerialize,
  desirialize = defaultDeserialize,
}) {
  const history = useHistory();
  const [value, setValue] = useState(() => {
    const initialValue = desirialize(
      getSearchParam(history.location.search, name)
    );

    return initialValue;
  });
  const latestValue = useLatest(value);

  const updateValue = useCallback(
    newValue => {
      const search = history.location.search;
      const actualNewValue =
        typeof newValue === 'function'
          ? newValue(latestValue.current)
          : newValue;

      setValue(actualNewValue);

      const newSearch = setSearchParam(search, name, serialize(actualNewValue));

      history.replace({
        search: newSearch,
      });
    },
    [latestValue, history, name, serialize]
  );

  return [value, updateValue];
}
