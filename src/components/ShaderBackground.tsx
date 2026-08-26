import React, { useState, useEffect, useMemo } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

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

  // Dark Mode Shader Configuration (Exact from user)
  const darkConfig = useMemo(() => ({
    animate: 'on',
    axesHelper: 'off',
    brightness: 1.2,
    cAzimuthAngle: 11,
    cDistance: 13.99,
    cPolarAngle: 96,
    cameraZoom: 1,
    color1: '#0A0C10',
    color2: '#0369A1',
    color3: '#047857',
    destination: 'onCanvas',
    embedMode: 'off',
    envPreset: 'city',
    format: 'gif',
    fov: 45,
    frameRate: 60,
    gizmoHelper: 'hide',
    grain: 'off',
    lightType: '3d',
    pixelDensity: 1.5,
    positionX: -1.4,
    positionY: 0,
    positionZ: 0,
    range: 'disabled',
    rangeEnd: 40,
    rangeStart: 0,
    reflection: 0.1,
    rotationX: 0,
    rotationY: 10,
    rotationZ: 50,
    shader: 'defaults',
    type: 'plane',
    uAmplitude: 1,
    uDensity: 0.5,
    uFrequency: 5.5,
    uSpeed: 0.1,
    uStrength: 3.6,
    uTime: 0,
    wireframe: false,
    zoomOut: false,
  }), []);

  // Light Mode Shader Configuration (Exact from user)
  const lightConfig = useMemo(() => ({
    animate: 'on',
    axesHelper: 'off',
    brightness: 1.2,
    cAzimuthAngle: 11,
    cDistance: 1.81,
    cPolarAngle: 96,
    cameraZoom: 1,
    color1: '#BAE6FD',
    color2: '#A7F3D0',
    color3: '#F7F9F8',
    destination: 'onCanvas',
    embedMode: 'off',
    envPreset: 'city',
    format: 'gif',
    fov: 45,
    frameRate: 60,
    gizmoHelper: 'hide',
    grain: 'off',
    lightType: '3d',
    pixelDensity: 1.5,
    positionX: -1.4,
    positionY: 0,
    positionZ: 0,
    range: 'disabled',
    rangeEnd: 40,
    rangeStart: 0,
    reflection: 0.1,
    rotationX: 0,
    rotationY: 10,
    rotationZ: 50,
    shader: 'defaults',
    type: 'plane',
    uAmplitude: 1,
    uDensity: 0.5,
    uFrequency: 5.5,
    uSpeed: 0.1,
    uStrength: 3.6,
    uTime: 0,
    wireframe: false,
    zoomOut: false,
  }), []);

  const currentConfig: any = isLight ? lightConfig : darkConfig;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        pixelDensity={1.5}
        fov={45}
      >
        <ShaderGradient {...currentConfig} />
      </ShaderGradientCanvas>
      
      {/* Light & Dark subtle contrast overlay for crisp UI text readability */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isLight ? 'bg-white/10' : 'bg-black/10'
        }`}
      />
    </div>
  );
};
