import { useMemo, useReducer } from 'react';

type AnyAction = {
  type: string;
  payload?: any;
};

type AnyActionCreator = (payload?: any) => void;

type Tail<T extends readonly unknown[]> = T extends readonly [any, ...infer U]
  ? U
  : never;

type Method<State> = (state: State, payload?: any) => State;

/* type UseMethodsActionCreator<
  ActionMethod extends Method<any>,
  PayloadType extends Parameters<ActionMethod>[1] = Parameters<ActionMethod>[1]
> = undefined extends PayloadType
  ? (payload?: PayloadType) => void
  : void extends PayloadType
  ? (payload?: PayloadType) => void
  : (payload: PayloadType) => void; */

type UseMethodsActionCreator<ActionMethod extends Method<any>> = (
  ...args: Tail<Parameters<ActionMethod>>
) => void;

type UseMethodsActionCreators<Methods extends Record<string, Method<any>>> = {
  [Key in keyof Methods]: UseMethodsActionCreator<Methods[Key]>;
};

export function useMethods<
  State,
  Methods extends Record<string, Method<State>>
>(
  methods: Methods | (() => Methods),
  initialState: State
): [State, UseMethodsActionCreators<Methods>] {
  const reducer = (state: State, action: AnyAction) => {
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

    return Object.keys(actualMethods).reduce(
      (result: Record<string, AnyActionCreator>, type) => {
        result[type] = (payload?: any) => {
          dispatch({ type, payload });
        };
        return result;
      },
      {}
    ) as UseMethodsActionCreators<Methods>;
  }, []);

  return [state, methodsActions];
}

const [state, actions] = useMethods(
  () => ({
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    },
    incrementBy(state, count: number) {
      return { ...state, count: state.count + count };
    },
    decrementBy(state, count: number) {
      return { ...state, count: state.count - count };
    },
  }),
  { count: 0 }
);
