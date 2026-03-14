import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp — Animates a number from 0 to `target` over `duration` ms.
 * @param {number} target - Target value to count up to
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * @returns {number} Current animated count
 */
export default function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const prevTargetRef = useRef(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // If target is unchanged, do nothing (initial render sets count to 0)
    if (target === prevTargetRef.current && count === target) return;

    const startValue = prevTargetRef.current;
    const valueRange = target - startValue;
    
    // Quick switch if no difference
    if (valueRange === 0) {
      setCount(target);
      return;
    }

    startTime.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const nextValue = Math.round(startValue + (valueRange * eased));
      setCount(nextValue);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    prevTargetRef.current = target;

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return count;
}
