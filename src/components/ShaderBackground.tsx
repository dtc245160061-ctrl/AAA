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
      {/* ── DARK MODE FLUID ORBS (100% Seamless Infinite Mathematical Loop, 0% CPU/GPU Load) ── */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Ocean Azure Orb #0369A1 */}
        <div 
          className="fluid-orb-1 absolute -top-[10%] -left-[10%] w-[75vw] h-[75vw] max-w-[1000px] max-h-[1000px] rounded-full opacity-50 filter blur-[60px] md:blur-[80px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(3, 105, 161, 0.65) 0%, rgba(3, 105, 161, 0.20) 45%, rgba(10, 12, 16, 0) 75%)',
          }}
        />

        {/* Forest Emerald Orb #047857 */}
        <div 
          className="fluid-orb-2 absolute -bottom-[15%] -right-[10%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full opacity-45 filter blur-[60px] md:blur-[80px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(4, 120, 87, 0.60) 0%, rgba(16, 185, 129, 0.20) 45%, rgba(10, 12, 16, 0) 75%)',
          }}
        />

        {/* Deep Cyan / Sea Glow #0284C7 */}
        <div 
          className="fluid-orb-3 absolute top-[25%] left-[20%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full opacity-35 filter blur-[50px] md:blur-[70px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.40) 0%, rgba(6, 78, 59, 0.15) 45%, rgba(10, 12, 16, 0) 75%)',
          }}
        />
      </div>

      {/* ── LIGHT MODE FLUID ORBS (100% Seamless Infinite Mathematical Loop, 0% CPU/GPU Load) ── */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Sky Mist Orb #BAE6FD */}
        <div 
          className="fluid-orb-1 absolute -top-[10%] -left-[10%] w-[75vw] h-[75vw] max-w-[1000px] max-h-[1000px] rounded-full opacity-70 filter blur-[60px] md:blur-[80px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(186, 230, 253, 0.85) 0%, rgba(186, 230, 253, 0.25) 45%, rgba(247, 249, 248, 0) 75%)',
          }}
        />

        {/* Mint Emerald Orb #A7F3D0 */}
        <div 
          className="fluid-orb-2 absolute -bottom-[15%] -right-[10%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full opacity-65 filter blur-[60px] md:blur-[80px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(167, 243, 208, 0.75) 0%, rgba(209, 250, 229, 0.30) 45%, rgba(247, 249, 248, 0) 75%)',
          }}
        />

        {/* Soft Pearlescent Glow #D1FAE5 */}
        <div 
          className="fluid-orb-3 absolute top-[25%] left-[20%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full opacity-50 filter blur-[50px] md:blur-[70px] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(209, 250, 229, 0.60) 0%, rgba(224, 242, 254, 0.25) 45%, rgba(247, 249, 248, 0) 75%)',
          }}
        />
      </div>

      {/* Subtle Atmospheric Text Contrast Balancer */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
          isLight ? 'bg-white/10' : 'bg-black/15'
        }`}
      />
    </div>
  );
};
