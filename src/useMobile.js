import { useState, useEffect } from 'react';

     const useMobile = (breakpoint = 1280) => {
       const [width, setWidth] = useState(
         typeof window !== 'undefined' ? window.innerWidth : null
       );

       useEffect(() => {
         if (typeof window === 'undefined') return;

         const handleResize = () => setWidth(window.innerWidth);
         setTimeout(() => handleResize(), 1); // Initial resize call
         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
       }, []);

       return width === null ? undefined : width <= breakpoint;
     };

     export default useMobile;
