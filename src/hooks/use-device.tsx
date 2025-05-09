
import { useState, useEffect } from "react";

export function useDevice() {
  const [device, setDevice] = useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isTablet: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent;
      const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const isAndroid = /Android/i.test(ua);
      const isTablet = /(iPad|tablet|(Android(?!.*mobile))|(Windows(?!.*phone)(.*touch))|Kindle|Silk.*tablet)/i.test(ua);
      
      setDevice({
        isMobile,
        isIOS,
        isAndroid,
        isTablet
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return device;
}
