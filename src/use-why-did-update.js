import { usePrevious } from './use-previous';

export function useWhyDidUpdate(props) {
  const prevPropsRef = usePrevious(props);

  const prevProps = prevPropsRef.current;

  if (!prevProps) {
    console.log('initial render');
    return;
  }

  const prevKeys = Object.keys(prevProps);
  const keys = Object.keys(props);

  const allKeys = [...new Set(keys.concat(prevKeys))];
  let hasChanged = false;

  allKeys.forEach(key => {
    if (props[key] !== prevProps[key]) {
      console.log('============');
      console.log(`prop ${key} chaged`);
      console.log(`prev value ${prevProps[key]}`);
      console.log(`current value ${props[key]}`);
      console.log('============');

      hasChanged = true;
    }
  });

  if (!hasChanged) {
    console.log('state changed');
  }
}
