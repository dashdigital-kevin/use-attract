import { useState, useEffect, useCallback } from 'react';

interface UseMobileReturn {
  isMobile: boolean | undefined;
  width: number | null;
}

const useMobile = (breakpoint: number = 768): boolean | undefined => {
  const [width, setWidth] = useState<number | null>(
    typeof window !== 'undefined' ? window.innerWidth : null
  );

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial width
    handleResize();

    // Add event listener with passive option for better performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Return undefined during SSR, boolean after hydration
  return width === null ? undefined : width <= breakpoint;
};

export default useMobile;
