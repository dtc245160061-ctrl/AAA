import React, { useState, useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
  className?: string;
  themeMode?: 'dark' | 'light' | 'system';
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ 
  className = '',
  themeMode
}) => {
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('light') || 
             document.documentElement.getAttribute('data-theme') === 'light';
    }
    return false;
  });

  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkTheme = () => {
      const isCurrentlyLight = 
        document.documentElement.classList.contains('light') || 
        document.documentElement.getAttribute('data-theme') === 'light';
      setIsLight(isCurrentlyLight);
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    return () => observer.disconnect();
  }, [themeMode]);

  // Ensure videos autoplay properly across all browsers
  useEffect(() => {
    if (darkVideoRef.current) {
      darkVideoRef.current.play().catch(() => {});
    }
    if (lightVideoRef.current) {
      lightVideoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Dark Mode Video Background - 60FPS Full Bleed Hardware Accelerated */}
      <video
        ref={darkVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isLight ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
      >
        <source src="/haven_bg_dark.mp4" type="video/mp4" />
      </video>

      {/* Light Mode Video Background - 60FPS Full Bleed Hardware Accelerated */}
      <video
        ref={lightVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isLight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
      >
        <source src="/haven_bg_light.mp4" type="video/mp4" />
      </video>

      {/* Subtle Depth & Contrast Overlay for Crystal Clear Typography */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
          isLight ? 'bg-white/15 backdrop-brightness-[0.98]' : 'bg-black/20 backdrop-brightness-[0.95]'
        }`}
      />
    </div>
  );
};
