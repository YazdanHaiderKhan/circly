
import React from 'react';

interface AdSpaceProps {
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const getAdDimensions = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return 'h-20 w-full';
      case 'left':
      case 'right':
        return 'h-96 w-full';
      default:
        return 'h-20 w-full';
    }
  };

  return (
    <div className={`${getAdDimensions()} mb-6 bg-black/20 border-2 border-dashed border-gray-600 rounded-lg`}>
    </div>
  );
};
