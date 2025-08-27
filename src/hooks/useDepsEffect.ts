import React, { useEffect, useRef } from 'react';
import { dequal as deepEqual } from 'dequal';

export function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>(value);
  const signalRef = React.useRef<number>(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => ref.current, [signalRef.current]);
}

const useDepsEffect = (
  func: () => void,
  deps: React.DependencyList | undefined,
) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, useDeepCompareMemoize(deps));
};

export default useDepsEffect;
