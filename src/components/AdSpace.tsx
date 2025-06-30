
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

  const getAdContent = () => {
    switch (position) {
      case 'top':
        return 'Header Advertisement Space (728x90)';
      case 'bottom':
        return 'Footer Advertisement Space (728x90)';
      case 'left':
        return 'Sidebar Ad Space (300x250)';
      case 'right':
        return 'Sidebar Ad Space (300x250)';
      default:
        return 'Advertisement Space';
    }
  };

  return (
    <div className={`${getAdDimensions()} mb-6 bg-black/20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-gray-500 font-mono text-sm">
          {getAdContent()}
        </div>
        <div className="text-gray-600 text-xs mt-1">
          Your ads here
        </div>
      </div>
    </div>
  );
};
