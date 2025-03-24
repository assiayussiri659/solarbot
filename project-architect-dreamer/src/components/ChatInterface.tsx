
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import ResponseArea from './ResponseArea';
import QueryInput from './QueryInput';
import FeedbackButtons from './FeedbackButtons';
import { Message, generateId } from '@/utils/chatUtils';
import { motion } from 'framer-motion';
import { delay } from '@/utils/animate';
import SolarSuggestions from './SolarSuggestions';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ChatInterfaceProps {
  initialMessages?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleSendQuery = async (inputQuery: string) => {
    // Create new user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputQuery,
      timestamp: new Date(),
    };
    
    // Update messages with user input
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send query to backend
      const response = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputQuery }),
      });
      
      // Parse response
      const data = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Check for error
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      
      // Create new assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };
      
      // Add response to messages
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Reset feedback state for new response
      setFeedbackGiven(false);
      
    } catch (error) {
      console.error('Error handling query:', error);
      setIsTyping(false);
      
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearInput = () => {
    setQuery('');
    setShowSuggestions(!showSuggestions);
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };
  
  const handlePositiveFeedback = () => {
    toast({
      title: "Thank you!",
      description: "We're glad this was helpful.",
    });
    setFeedbackGiven(true);
    
    // Add system message about the feedback
    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: 'Response marked as helpful. Thank you for your feedback!',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, systemMessage]);
  };
  
  const handleNegativeFeedback = () => {
    toast({
      title: "We're sorry",
      description: "Your feedback helps us improve our responses.",
    });
    setFeedbackGiven(true);
    
    // Add system message about the feedback
    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: "Response marked as unhelpful. We'll use this feedback to improve.",
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, systemMessage]);
  };
  
  const handleClearChat = () => {
    setMessages([]);
    setFeedbackGiven(false);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-yellow-50/70 backdrop-blur-md rounded-2xl overflow-hidden border border-yellow-200 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-yellow-200 bg-white/50">
        <h3 className="text-sm font-medium text-gray-800">Solar Energy Chat</h3>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-gray-500 hover:text-gray-700 hover:bg-yellow-50"
          >
            <Trash2 size={16} />
            <span className="ml-1 text-xs">Clear Chat</span>
          </Button>
        )}
      </div>
      
      <ResponseArea messages={messages} isTyping={isTyping} />
      
      <div className="border-t border-yellow-200 p-4 bg-white/70 sticky bottom-0 left-0 right-0">
        {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isTyping && (
          <FeedbackButtons 
            onPositiveFeedback={handlePositiveFeedback}
            onNegativeFeedback={handleNegativeFeedback}
            feedbackGiven={feedbackGiven}
          />
        )}
        
        {showSuggestions && (
          <SolarSuggestions onSelectSuggestion={handleSelectSuggestion} />
        )}
        
        <QueryInput 
          onSubmit={handleSendQuery} 
          isDisabled={isTyping}
          placeholder="Ask about solar energy solutions..."
          value={query}
          onChange={setQuery}
          onClear={handleClearInput}
        />
      </div>
    </motion.div>
  );
};

export default ChatInterface;
