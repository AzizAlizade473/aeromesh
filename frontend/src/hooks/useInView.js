import { useState, useEffect, useRef } from 'react';

/**
 * useInView — IntersectionObserver hook that fires once when element enters viewport.
 * @param {number} threshold - Visibility threshold (0-1), default 0.2
 * @returns {[React.RefObject, boolean]} [ref, inView]
 */
export default function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element); // Fire once
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
