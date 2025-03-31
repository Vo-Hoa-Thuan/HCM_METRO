
import React, { HTMLAttributes, forwardRef, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  animate?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    rotateX?: number;
    rotateY?: number;
  };
  initial?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
    rotateX?: number;
    rotateY?: number;
  };
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
  whileHover?: {
    scale?: number;
    rotate?: number;
    y?: number;
  };
  whileTap?: {
    scale?: number;
  };
  viewport?: {
    once?: boolean;
    margin?: string;
  };
}

export const motion = {
  div: forwardRef<HTMLDivElement, MotionProps>(({ 
    className, 
    children, 
    animate,
    initial,
    transition,
    whileHover,
    whileTap,
    viewport,
    ...props 
  }, ref) => {
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRef(ref, elementRef);
    
    useEffect(() => {
      if (!viewport) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        {
          rootMargin: viewport.margin || '0px',
          threshold: 0.1,
        }
      );
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, [viewport]);

    const animateStyles = animate ? {
      opacity: animate.opacity,
      transform: `
        translate(${animate.x || 0}px, ${animate.y || 0}px)
        scale(${animate.scale || 1})
        rotate(${animate.rotate || 0}deg)
        rotateX(${animate.rotateX || 0}deg)
        rotateY(${animate.rotateY || 0}deg)
      `,
    } : {};

    const transitionStyles = transition ? {
      transition: `all ${transition.duration || 0.3}s ${transition.ease || 'ease'} ${transition.delay || 0}s`,
    } : {};

    const hoverStyles = whileHover ? {
      '--hover-scale': whileHover.scale || 1,
      '--hover-rotate': `${whileHover.rotate || 0}deg`,
      '--hover-translateY': `${whileHover.y || 0}px`,
    } : {};

    const tapStyles = whileTap ? {
      '--tap-scale': whileTap.scale || 1,
    } : {};

    const initialStyles = initial ? {
      opacity: initial.opacity,
      transform: `
        translate(${initial.x || 0}px, ${initial.y || 0}px)
        scale(${initial.scale || 1})
        rotate(${initial.rotate || 0}deg)
        rotateX(${initial.rotateX || 0}deg)
        rotateY(${initial.rotateY || 0}deg)
      `,
    } : {};

    const shouldAnimate = !viewport || isInView || viewport.once && isInView;
    
    // For animation to work, we need to add transition styles
    // to a default class that all motion components would have
    const motionClass = cn(
      'motion-component',
      {
        'hover:scale-[var(--hover-scale)] hover:rotate-[var(--hover-rotate)] hover:translate-y-[var(--hover-translateY)]': whileHover,
        'active:scale-[var(--tap-scale)]': whileTap,
      },
      className
    );

    return (
      <div
        ref={combinedRef}
        className={motionClass}
        style={{
          ...initialStyles,
          ...(shouldAnimate ? animateStyles : {}),
          ...transitionStyles,
          ...hoverStyles,
          ...tapStyles,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }),
  
  button: forwardRef<HTMLButtonElement, MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(({
    className,
    children,
    animate,
    initial,
    transition,
    whileHover,
    whileTap,
    viewport,
    ...props
  }, ref) => {
    // Similar implementation as div but for button
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<HTMLButtonElement>(null);
    const combinedRef = useCombinedRef(ref, elementRef);
    
    useEffect(() => {
      if (!viewport) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        {
          rootMargin: viewport.margin || '0px',
          threshold: 0.1,
        }
      );
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      
      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, [viewport]);

    const animateStyles = animate ? {
      opacity: animate.opacity,
      transform: `
        translate(${animate.x || 0}px, ${animate.y || 0}px)
        scale(${animate.scale || 1})
        rotate(${animate.rotate || 0}deg)
        rotateX(${animate.rotateX || 0}deg)
        rotateY(${animate.rotateY || 0}deg)
      `,
    } : {};

    const transitionStyles = transition ? {
      transition: `all ${transition.duration || 0.3}s ${transition.ease || 'ease'} ${transition.delay || 0}s`,
    } : {};

    const hoverStyles = whileHover ? {
      '--hover-scale': whileHover.scale || 1,
      '--hover-rotate': `${whileHover.rotate || 0}deg`,
      '--hover-translateY': `${whileHover.y || 0}px`,
    } : {};

    const tapStyles = whileTap ? {
      '--tap-scale': whileTap.scale || 1,
    } : {};

    const initialStyles = initial ? {
      opacity: initial.opacity,
      transform: `
        translate(${initial.x || 0}px, ${initial.y || 0}px)
        scale(${initial.scale || 1})
        rotate(${initial.rotate || 0}deg)
        rotateX(${initial.rotateX || 0}deg)
        rotateY(${initial.rotateY || 0}deg)
      `,
    } : {};

    const shouldAnimate = !viewport || isInView || viewport.once && isInView;
    
    const motionClass = cn(
      'motion-component',
      {
        'hover:scale-[var(--hover-scale)] hover:rotate-[var(--hover-rotate)] hover:translate-y-[var(--hover-translateY)]': whileHover,
        'active:scale-[var(--tap-scale)]': whileTap,
      },
      className
    );

    return (
      <button
        ref={combinedRef}
        className={motionClass}
        style={{
          ...initialStyles,
          ...(shouldAnimate ? animateStyles : {}),
          ...transitionStyles,
          ...hoverStyles,
          ...tapStyles,
        }}
        {...props}
      >
        {children}
      </button>
    );
  })
};

// Helper for combining refs
function useCombinedRef<T>(
  externalRef: React.ForwardedRef<T>,
  internalRef: React.RefObject<T>
) {
  return React.useCallback(
    (instance: T | null) => {
      // Update internal ref
      (internalRef as React.MutableRefObject<T | null>).current = instance;
      
      // Forward to external ref
      if (typeof externalRef === 'function') {
        externalRef(instance);
      } else if (externalRef) {
        externalRef.current = instance;
      }
    },
    [externalRef, internalRef]
  );
}

// Add perspective to CSS
// Apply to the parent container of your 3D elements
export const Perspective: React.FC<{
  children: React.ReactNode;
  className?: string;
  perspective?: number;
}> = ({ children, className, perspective = 1000 }) => {
  return (
    <div className={cn('transition-all duration-300', className)} style={{ perspective: `${perspective}px` }}>
      {children}
    </div>
  );
};

// 3D Card component that responds to mouse movement
export const Card3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className, intensity = 20 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * intensity;
    const rotateX = -((y - centerY) / centerY) * intensity;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'transition-transform duration-200 transform-gpu',
        className
      )}
      style={{
        transform: isHovering ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : 'rotateX(0) rotateY(0)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={resetRotation}
    >
      {children}
    </div>
  );
};
