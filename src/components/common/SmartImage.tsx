import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

function optimizeUnsplashUrl(url?: string, width = 600, quality = 75): string {
  if (!url) {
    return `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  if (!url.includes('images.unsplash.com')) {
    return url;
  }
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export interface SmartImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  quality?: number;
  priority?: boolean;
  fallbackSrc?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  width = 600,
  quality = 75,
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=75&w=600',
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset loading status if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const targetSrc = hasError 
    ? fallbackSrc 
    : optimizeUnsplashUrl(src, width, quality);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-slate-950 ${containerClassName}`}
      onClick={onClick}
    >
      {/* High-end Skeleton Shimmer Loader (eliminates pitch-black empty states) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 bg-slate-800/90 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-700/50 border border-white/5 flex items-center justify-center text-slate-400/50">
            <Building2 className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      )}

      {/* Optimized Lazy-loaded Image */}
      <img
        src={targetSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};
