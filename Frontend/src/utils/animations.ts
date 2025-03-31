
import { useState, useEffect } from 'react';

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const slideDown = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const slideRight = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const slideLeft = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    x: -20, 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

export const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

// Hook for lazy loading images with blur effect
export const useLazyImage = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    setIsLoaded(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);

  return { isLoaded, currentSrc };
};

// Hook for intersection observer (for animations on scroll)
export const useInView = (options = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { ref: setRef, isInView };
};

// Function to create a staggered animation for multiple elements
export const staggeredAnimation = (delay: number = 0.1) => {
  return (index: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: index * delay,
        duration: 0.5
      }
    }
  });
};
