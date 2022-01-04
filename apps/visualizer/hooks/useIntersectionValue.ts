import { useState, useEffect } from "react";

export function useIntersectionValue<TRef extends Element, TValue>(
  ref: React.MutableRefObject<TRef>,
  saturatedValue: TValue,
  unsaturatedValue: TValue,
  noIntersectionFallbackValue: TValue
) {
  const [hasObserver, setHasObserver] = useState(false);
  const [value, setValue] = useState<TValue>(() => noIntersectionFallbackValue);

  useEffect(() => {
    setHasObserver(!!window?.IntersectionObserver);
  }, []);

  useEffect(() => {
    const currentRef = ref.current;

    if (hasObserver && currentRef) {
      const observer = new IntersectionObserver(
        ([e]) => {
          const ratio = e.intersectionRatio;
          setValue(() => (ratio >= 1 ? saturatedValue : unsaturatedValue));
        },
        {
          threshold: [1],
        }
      );

      observer.observe(currentRef);

      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [hasObserver, ref, saturatedValue, unsaturatedValue]);

  return value;
}
