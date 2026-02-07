import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-X9B4TDCQJ0', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}
