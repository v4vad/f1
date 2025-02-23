import { useEffect, useRef, useState } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
}

interface UseVirtualizationReturn {
  virtualItems: Array<{ index: number; offsetTop: number }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualization(
  totalItems: number,
  options: UseVirtualizationOptions
): UseVirtualizationReturn {
  const { itemHeight, overscan = 3, containerHeight } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  return {
    virtualItems,
    totalHeight: totalItems * itemHeight,
    startIndex,
    endIndex,
    containerRef,
  };
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  options: {
    threshold?: number;
    hasMore: boolean;
  }
) {
  const { threshold = 0.8, hasMore } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          setLoading(true);
          onLoadMore();
          setLoading(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [onLoadMore, threshold, hasMore, loading]);

  return {
    containerRef,
    loading,
  };
} 