import { useMemo, useReducer } from 'react';

export function useMethods(methods, initialState) {
  const reducer = (state, action) => {
    const { type, payload } = action;
    const actualMethods = typeof methods === 'function' ? methods() : methods;

    const method = actualMethods[type];

    if (!method) {
      return state;
    }

    return method(state, payload);
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const methodsActions = useMemo(() => {
    const actualMethods = typeof methods === 'function' ? methods() : methods;

    return Object.keys(actualMethods).reduce((result, type) => {
      result[type] = payload => {
        dispatch({ type, payload });
      };
      return result;
    }, {});
  }, []);

  return [state, methodsActions];
}
