'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CompareSliderProps {
  original: string;
  modified: string;
  originalLabel?: string;
  modifiedLabel?: string;
  height?: string;
}

export default function CompareSlider({
  original,
  modified,
  originalLabel = 'Before',
  modifiedLabel = 'After',
  height = 'h-[400px]',
}: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${height} rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl select-none`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      style={{ touchAction: 'none' }}
    >
      {/* Modified (Right side) - background image */}
      <img
        src={modified}
        alt="Modified"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div className="absolute right-4 bottom-4 bg-brand-secondary/80 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-sm z-10">
        {modifiedLabel}
      </div>

      {/* Original (Left side) - clipped overlay image */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={original}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ width: containerRef.current?.getBoundingClientRect().width }}
        />
        <div className="absolute left-4 bottom-4 bg-brand-primary/80 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-sm z-10">
          {originalLabel}
        </div>
      </div>

      {/* Divider slider bar */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-brand-primary shadow-2xl flex items-center justify-center cursor-ew-resize">
          <div className="flex gap-[3px] items-center">
            <span className="w-1.5 h-3 border-r-2 border-brand-primary block rotate-180"></span>
            <span className="w-1.5 h-3 border-l-2 border-brand-primary block"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
