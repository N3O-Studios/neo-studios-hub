import React from 'react';

interface StemSplitterIconProps {
  className?: string;
  size?: number;
}

export const StemSplitterIcon: React.FC<StemSplitterIconProps> = ({ 
  className = "", 
  size = 16 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main horizontal line */}
      <line x1="2" y1="12" x2="10" y2="12" />
      
      {/* Splitting point */}
      <circle cx="10" cy="12" r="1" fill="currentColor" />
      
      {/* Branch lines - rectilinear drainage pattern */}
      <line x1="10" y1="12" x2="22" y2="6" />
      <line x1="10" y1="12" x2="22" y2="12" />
      <line x1="10" y1="12" x2="22" y2="18" />
      
      {/* Secondary branches */}
      <line x1="16" y1="6" x2="20" y2="4" />
      <line x1="16" y1="6" x2="20" y2="8" />
      <line x1="16" y1="18" x2="20" y2="16" />
      <line x1="16" y1="18" x2="20" y2="20" />
    </svg>
  );
};