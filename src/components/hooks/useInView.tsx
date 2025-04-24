import React, { useEffect, useState, useRef } from 'react';
interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
}
export const useInView = (options: InViewOptions = {}): [React.RefObject<any>, boolean] => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px'
    });
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.rootMargin]);
  return [ref, isVisible];
};