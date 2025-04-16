import { useEffect, useRef } from 'react';
import barba from '@barba/core';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize Barba
    barba.init({
      transitions: [
        {
          name: 'default-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              y: -50,
              duration: 0.5,
              ease: 'power2.inOut'
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0,
              y: 50,
              duration: 0.5,
              ease: 'power2.inOut'
            });
          }
        }
      ],
      views: [
        {
          namespace: 'home',
          beforeEnter() {
            // Custom logic for home page
          }
        },
        {
          namespace: 'projects',
          beforeEnter() {
            // Custom logic for projects page
          }
        },
        // Add more views for other pages as needed
      ],
      rules: [
        {
          name: 'home-to-projects',
          from: { namespace: 'home' },
          to: { namespace: 'projects' },
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              x: -100,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0,
              x: 100,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          }
        },
        // Add more custom transitions as needed
      ]
    });

    // Clean up
    return () => {
      barba.destroy();
    };
  }, []);

  // Force re-render on location change to work with React Router
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
  }, [location]);

  return (
    <div 
      ref={containerRef} 
      data-barba="container" 
      data-barba-namespace={location.pathname === '/' ? 'home' : location.pathname.substring(1)}
    >
      {children}
    </div>
  );
};

export default PageTransition;
