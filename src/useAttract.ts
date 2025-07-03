import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import useMobile from './useMobile';

export interface Position {
  x: number;
  y: number;
}

export interface UseAttractOptions {
  enabled?: boolean;
  strength?: number;
  magneticField?: number;
  lerpFactor?: number;
}

export interface UseAttractReturn {
  ref: React.RefObject<HTMLElement | null>;
  style: React.CSSProperties;
  position: Position;
}

const useAttract = ({
  enabled = true,
  strength = 50,
  magneticField = 32,
  lerpFactor = 0.2,
}: UseAttractOptions = {}): UseAttractReturn => {
  const mobile = useMobile();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMouseEventRef = useRef<MouseEvent | null>(null);

  // Skip execution during SSR
  if (typeof window === 'undefined') {
    return {
      ref: elementRef,
      style: { transform: 'translate(0px, 0px)' },
      position,
    };
  }

  // Memoize the lerp function
  const lerp = useCallback((start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }, []);

  // Memoize the easing function
  const easeOutQuart = useCallback((x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  }, []);

  // Improved mouse move handler with better bounds checking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (mobile || !elementRef.current || !enabled) return;

    const element = elementRef.current;
    const bounds = element.getBoundingClientRect();

    // Early exit if element is not visible
    if (bounds.width === 0 || bounds.height === 0) return;

    const elementCenterX = bounds.left + bounds.width / 2;
    const elementCenterY = bounds.top + bounds.height / 2;
    const distanceX = e.clientX - elementCenterX;
    const distanceY = e.clientY - elementCenterY;

    const extendedBounds = {
      left: bounds.left - magneticField,
      right: bounds.right + magneticField,
      top: bounds.top - magneticField,
      bottom: bounds.bottom + magneticField,
    };

    // Check if mouse is within the magnetic field
    if (
      e.clientX >= extendedBounds.left &&
      e.clientX <= extendedBounds.right &&
      e.clientY >= extendedBounds.top &&
      e.clientY <= extendedBounds.bottom
    ) {
      const maxDistance = Math.max(bounds.width, bounds.height) / 2 + magneticField;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance > 0) {
        const pull = easeOutQuart(Math.max(0, 1 - distance / maxDistance));
        const targetX = (distanceX / maxDistance) * strength * pull;
        const targetY = (distanceY / maxDistance) * strength * pull;

        setPosition((prev) => ({
          x: lerp(prev.x, targetX, lerpFactor),
          y: lerp(prev.y, targetY, lerpFactor),
        }));
      }
    } else {
      // Mouse is outside magnetic field, reset position
      setPosition((prev) => ({
        x: lerp(prev.x, 0, lerpFactor),
        y: lerp(prev.y, 0, lerpFactor),
      }));
    }
  }, [mobile, enabled, strength, magneticField, lerpFactor, lerp, easeOutQuart]);

  // Improved mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setPosition((prev) => ({
      x: lerp(prev.x, 0, lerpFactor),
      y: lerp(prev.y, 0, lerpFactor),
    }));
  }, [lerpFactor, lerp]);

  // Animation loop with better performance
  const animate = useCallback(() => {
    if (lastMouseEventRef.current) {
      handleMouseMove(lastMouseEventRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [handleMouseMove]);

  // Global mouse move handler
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    lastMouseEventRef.current = e;
    
    if (!animationFrameRef.current) {
      animate();
    }
  }, [animate]);

  // Global mouse leave handler
  const handleGlobalMouseLeave = useCallback(() => {
    lastMouseEventRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    handleMouseLeave();
  }, [handleMouseLeave]);

  // Effect for setting up event listeners
  useEffect(() => {
    if (mobile || !enabled) {
      // Clean up any existing animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleGlobalMouseLeave, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [mobile, enabled, handleGlobalMouseMove, handleGlobalMouseLeave]);

  // Memoize the style object to prevent unnecessary re-renders
  const magneticStyle = useMemo((): React.CSSProperties => {
    const isAtRest = position.x === 0 && position.y === 0;
    
    return {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isAtRest
        ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none',
    };
  }, [position.x, position.y]);

  return {
    ref: elementRef,
    style: magneticStyle,
    position,
  };
};

export default useAttract;
