
import React, { useRef, useEffect } from 'react';
import { Message } from '@/utils/chatUtils';
import MessageBubble from './MessageBubble';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResponseAreaProps {
  messages: Message[];
  isTyping?: boolean;
}

const ResponseArea: React.FC<ResponseAreaProps> = ({ messages, isTyping = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Improved scroll to bottom effect
  useEffect(() => {
    // Using a slight delay to ensure animations complete
    const scrollTimeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    return () => clearTimeout(scrollTimeout);
  }, [messages, isTyping]);
  
  // If no messages, show welcome screen
  if (messages.length === 0) {
    return (
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
        >
          <svg 
            className="w-8 h-8 text-yellow-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 21H15M12 17V21M7 8H3V17H7V8ZM21 8H17V17H21V8ZM17 12H7V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h2 
          className="text-xl font-medium text-gray-900 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Intelligent Support Assistant
        </motion.h2>
        <motion.p 
          className="text-gray-700 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Ask any customer support question and I'll help you find the answer. 
          For complex issues, I'll connect you with a human agent.
        </motion.p>
        
        <motion.div 
          className="mt-8 grid grid-cols-2 gap-3 text-left"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm">
            <div className="text-sm font-medium text-gray-900 mb-1">Return Policy</div>
            <div className="text-xs text-gray-700">How can I return an item that I purchased?</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm">
            <div className="text-sm font-medium text-gray-900 mb-1">Shipping Status</div>
            <div className="text-xs text-gray-700">When will my order arrive?</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm">
            <div className="text-sm font-medium text-gray-900 mb-1">Account Login</div>
            <div className="text-xs text-gray-700">I forgot my password and can't log in</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm">
            <div className="text-sm font-medium text-gray-900 mb-1">Subscription</div>
            <div className="text-xs text-gray-700">How do I cancel my monthly plan?</div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="flex-1 w-full h-[450px]">
      <div className="p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              index={index}
              showAnimatedTyping={index === messages.length - 1 && message.role === 'assistant'}
            />
          ))}
          
          {isTyping && (
            <MessageBubble 
              key="typing"
              message={{
                id: 'typing',
                role: 'assistant',
                content: '',
                timestamp: new Date()
              }}
              isTyping={true}
              index={messages.length}
            />
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-px" />
      </div>
    </ScrollArea>
  );
};

export default ResponseArea;
