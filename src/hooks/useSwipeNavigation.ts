import { useEffect, useRef, useState } from 'react';

type SwipeDirection = 'left' | 'right';

type SwipeHandlers = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  minSpeed = 0.5,
}: SwipeHandlers & {
  threshold?: number;
  minSpeed?: number;
}) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      // If vertical scrolling is dominant, ignore the swipe
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        touchStart.current = null;
        setIsSwiping(false);
        return;
      }

      // Prevent scrolling while swiping horizontally
      if (Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaTime = Date.now() - touchStart.current.time;
      const speed = Math.abs(deltaX) / deltaTime;

      if (Math.abs(deltaX) > threshold && speed > minSpeed) {
        const direction: SwipeDirection = deltaX > 0 ? 'right' : 'left';
        if (direction === 'left' && onSwipeLeft) {
          onSwipeLeft();
        } else if (direction === 'right' && onSwipeRight) {
          onSwipeRight();
        }
      }

      touchStart.current = null;
      setIsSwiping(false);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, minSpeed]);

  return { isSwiping };
} 