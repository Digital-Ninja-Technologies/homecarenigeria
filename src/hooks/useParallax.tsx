import { useEffect, useState, useRef, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number; // 0.1 to 1, lower = slower parallax
  direction?: 'up' | 'down';
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
): [RefObject<T>, { transform: string }] {
  const { speed = 0.3, direction = 'up' } = options;
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when element is in view
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        const scrolled = window.scrollY;
        const multiplier = direction === 'up' ? -1 : 1;
        setOffset(scrolled * speed * multiplier);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return [ref, { transform: `translateY(${offset}px)` }];
}

export default useParallax;
