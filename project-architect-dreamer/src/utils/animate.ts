
import { useEffect, useState } from 'react';

// Delay function for sequential animations
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for delayed mounting animations
export const useDelayedAppear = (initialDelay = 0, step = 100, items = 1): boolean[] => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(items).fill(false));

  useEffect(() => {
    const showItems = async () => {
      await delay(initialDelay);
      
      const newVisibleItems = [...visibleItems];
      for (let i = 0; i < items; i++) {
        newVisibleItems[i] = true;
        setVisibleItems([...newVisibleItems]);
        await delay(step);
      }
    };

    showItems();
  }, []);

  return visibleItems;
};

// Function to add staggered animation classes based on index
export const staggeredAnimationClass = (
  index: number, 
  baseClass: string, 
  baseDelay = 100
): string => {
  const delay = baseDelay * index;
  return `${baseClass} animate-duration-300 animate-delay-${delay}`;
};

// Text animation effect for smooth character reveal
export const typeText = async (
  text: string, 
  setText: (text: string) => void, 
  speed = 20
): Promise<void> => {
  let currentText = '';
  
  for (let i = 0; i < text.length; i++) {
    currentText += text.charAt(i);
    setText(currentText);
    await delay(speed);
  }
};

// For smooth opacity transitions
export const fadeInOut = (
  isVisible: boolean, 
  durationIn = 300, 
  durationOut = 200
): string => {
  return isVisible 
    ? `opacity-100 transition-opacity duration-${durationIn} ease-in`
    : `opacity-0 transition-opacity duration-${durationOut} ease-out`;
};
