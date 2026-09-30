import React, { useState, useEffect } from 'react';

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

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-colors duration-700 ${
        isLight ? 'bg-[#F7F9F8]' : 'bg-[#0A0C10]'
      } ${className}`}
      aria-hidden="true"
    >
      {/* ── DARK MODE ATMOSPHERIC GRADIENTS (Zero GPU Load, Native 144FPS) ── */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(3, 105, 161, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 85%, rgba(4, 120, 87, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.08) 0%, transparent 60%)
          `
        }}
      />

      {/* ── LIGHT MODE ATMOSPHERIC GRADIENTS (Zero GPU Load, Native 144FPS) ── */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(186, 230, 253, 0.40) 0%, transparent 50%),
            radial-gradient(circle at 90% 85%, rgba(167, 243, 208, 0.45) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(209, 250, 229, 0.25) 0%, transparent 60%)
          `
        }}
      />

      {/* Subtle Atmospheric Text Contrast Balancer */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
          isLight ? 'bg-white/10' : 'bg-black/15'
        }`}
      />
    </div>
  );
};
