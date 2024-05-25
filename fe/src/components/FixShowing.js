import { useEffect } from 'react';

export function FixShowing ({ children }) {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(function () {
        window.document.body.style.opacity = '1';
      }, 0);

      setTimeout(function () {
        window.document.body.style.overflow = 'auto';
      }, 500);
    }
  }, []);

  return children;
}
