
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FeedbackButtonsProps {
  onPositiveFeedback: () => void;
  onNegativeFeedback: () => void;
  feedbackGiven: boolean;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ 
  onPositiveFeedback, 
  onNegativeFeedback,
  feedbackGiven
}) => {
  if (feedbackGiven) {
    return (
      <motion.div 
        className="text-sm text-center text-gray-500 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Thank you for your feedback!
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-center justify-center space-x-4 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm text-gray-500">Was this response helpful?</span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full h-8 px-3 text-xs bg-white hover:bg-green-50 hover:text-green-600 border-gray-200"
        onClick={onPositiveFeedback}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
        Yes
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full h-8 px-3 text-xs bg-white hover:bg-red-50 hover:text-red-600 border-gray-200"
        onClick={onNegativeFeedback}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
        </svg>
        No
      </Button>
    </motion.div>
  );
};

export default FeedbackButtons;
