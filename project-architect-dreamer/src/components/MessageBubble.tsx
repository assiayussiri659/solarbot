
import React, { useEffect, useState } from 'react';
import { Message } from '@/utils/chatUtils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { typeText } from '@/utils/animate';
import StatusIndicator from './StatusIndicator';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
  showAnimatedTyping?: boolean;
  index: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isTyping = false,
  showAnimatedTyping = false,
  index
}) => {
  const [displayText, setDisplayText] = useState('');
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  // Animate text typing effect for assistant messages
  useEffect(() => {
    if (message.role === 'assistant' && showAnimatedTyping) {
      typeText(message.content, setDisplayText, 15);
    } else {
      setDisplayText(message.content);
    }
  }, [message.content, message.role, showAnimatedTyping]);
  
  // Define style variations based on message role
  const bubbleStyle = {
    user: "bg-yellow-100 text-gray-900 ml-auto rounded-2xl rounded-tr-sm",
    assistant: "bg-white text-gray-900 mr-auto rounded-2xl rounded-tl-sm border border-yellow-200",
    system: "bg-gray-50 text-gray-600 mx-auto rounded-2xl text-sm italic border border-yellow-100",
  };
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        delay: index * 0.1, // Staggered delay based on index
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className={cn(
        "px-4 py-3 max-w-[85%] md:max-w-[70%] shadow-sm",
        bubbleStyle[message.role]
      )}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      {isTyping ? (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-1">
            {!isUser && !isSystem && (
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mr-2 flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-3 h-3 text-white" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            
            {isUser && (
              <div className="w-5 h-5 rounded-full bg-yellow-100 mr-2 flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-3 h-3 text-yellow-600" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.9691 18C19.2239 16.8182 20 15.2066 20 13.4C20 10.4186 17.7614 8 15 8C12.2386 8 10 10.4186 10 13.4C10 16.3814 12.2386 18.8 15 18.8C15.7529 18.8 16.4655 18.6428 17.1102 18.3589" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path d="M3.5 15.5C4.1082 17.3989 5.0525 19 7 19M7 19C5.5 19 4.5 20.5 4 22M7 19C8.5 19 9.5 20.5 10 22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <circle cx="15" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            )}
            
            <div className="flex-1">
              <div className="text-xs text-gray-500">
                {isUser ? 'You' : isSystem ? 'System' : 'Assistant'}
              </div>
            </div>
            
            {message.escalationScore && message.escalationScore > 0 && (
              <StatusIndicator score={message.escalationScore} />
            )}
          </div>
          
          <div className="text-base whitespace-pre-wrap">{displayText}</div>
          
          <div className="text-xs text-gray-400 mt-1 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MessageBubble;
