import { useState, useRef, useEffect } from 'react';
import useMobile from './useMobile';

const useMagnetic = ({
  enabled = true,
  strength = 50,
  magneticField = 32,
  lerpFactor = 0.2,
} = {}) => {
  const mobile = useMobile();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  // Skip execution during SSR
  if (typeof window === 'undefined') {
    return {
      ref: elementRef,
      style: { transform: 'translate(0rem, 0rem)' },
      position,
    };
  }

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const handleMouseMove = (e) => {
    if (mobile || !elementRef.current || !enabled) return;

    const element = elementRef.current;
    const bounds = element.getBoundingClientRect();

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

    if (
      e.clientX >= extendedBounds.left &&
      e.clientX <= extendedBounds.right &&
      e.clientY >= extendedBounds.top &&
      e.clientY <= extendedBounds.bottom
    ) {
      const maxDistance = Math.max(bounds.width, bounds.height) / 2 + magneticField;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
      const pull = easeOutQuart(Math.max(0, 1 - distance / maxDistance));

      const targetX = (distanceX / maxDistance) * strength * pull;
      const targetY = (distanceY / maxDistance) * strength * pull;

      setPosition((prev) => ({
        x: lerp(prev.x, targetX, lerpFactor),
        y: lerp(prev.y, targetY, lerpFactor),
      }));
    } else {
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    setPosition((prev) => ({
      x: lerp(prev.x, 0, lerpFactor),
      y: lerp(prev.y, 0, lerpFactor),
    }));
  };

  useEffect(() => {
    if (mobile || !enabled) return;

    let animationFrameId;
    let isMoving = false;

    const animate = () => {
      handleMouseMove(lastMouseEvent);
      animationFrameId = requestAnimationFrame(animate);
    };

    let lastMouseEvent;
    const handleGlobalMouseMove = (e) => {
      lastMouseEvent = e;
      if (!isMoving) {
        isMoving = true;
        animate();
      }
    };

    const handleGlobalMouseLeave = () => {
      isMoving = false;
      cancelAnimationFrame(animationFrameId);
      handleMouseLeave();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mobile, enabled, strength, magneticField, lerpFactor]);

  const magneticStyle = {
    transform: `translate(${position.x}rem, ${position.y}rem)`,
    transition:
      position.x === 0 && position.y === 0
        ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none',
  };

  return {
    ref: elementRef,
    style: magneticStyle,
    position,
  };
};

export default useMagnetic;