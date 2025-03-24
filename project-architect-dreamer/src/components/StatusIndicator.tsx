
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  score: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ score }) => {
  // Determine color based on score
  const getColor = () => {
    if (score > 70) return 'bg-red-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determine label based on score
  const getLabel = () => {
    if (score > 70) return 'High Priority';
    if (score > 40) return 'Medium Priority';
    return 'Low Priority';
  };
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn(
        "h-2 w-2 rounded-full animate-pulse-subtle",
        getColor()
      )} />
      <span className="text-xs font-medium text-gray-500">
        {getLabel()}
      </span>
    </div>
  );
};

export default StatusIndicator;
