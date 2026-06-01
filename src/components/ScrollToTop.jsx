import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que la ruta cambie, mandamos el scroll al inicio (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;