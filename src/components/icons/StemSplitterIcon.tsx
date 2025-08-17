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
      {/* Main horizontal bar */}
      <line x1="2" y1="12" x2="8" y2="12" strokeWidth="3" />
      
      {/* Primary split into 3 branches */}
      <line x1="8" y1="12" x2="14" y2="8" strokeWidth="2" />
      <line x1="8" y1="12" x2="14" y2="12" strokeWidth="2" />
      <line x1="8" y1="12" x2="14" y2="16" strokeWidth="2" />
      
      {/* Secondary splits - top branch */}
      <line x1="14" y1="8" x2="18" y2="6" strokeWidth="1.5" />
      <line x1="14" y1="8" x2="18" y2="10" strokeWidth="1.5" />
      
      {/* Secondary splits - middle branch */}
      <line x1="14" y1="12" x2="18" y2="11" strokeWidth="1.5" />
      <line x1="14" y1="12" x2="18" y2="13" strokeWidth="1.5" />
      
      {/* Secondary splits - bottom branch */}
      <line x1="14" y1="16" x2="18" y2="14" strokeWidth="1.5" />
      <line x1="14" y1="16" x2="18" y2="18" strokeWidth="1.5" />
      
      {/* Tertiary splits */}
      <line x1="18" y1="6" x2="22" y2="5" strokeWidth="1" />
      <line x1="18" y1="10" x2="22" y2="9" strokeWidth="1" />
      <line x1="18" y1="11" x2="22" y2="10.5" strokeWidth="1" />
      <line x1="18" y1="13" x2="22" y2="13.5" strokeWidth="1" />
      <line x1="18" y1="14" x2="22" y2="15" strokeWidth="1" />
      <line x1="18" y1="18" x2="22" y2="19" strokeWidth="1" />
    </svg>
  );
};