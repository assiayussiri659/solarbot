
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap, Sun } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ 
  onSubmit, 
  isDisabled = false,
  placeholder = "Ask a question...",
  value,
  onChange,
  onClear
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isDisabled) {
      onSubmit(value.trim());
      onChange('');
      // Reset height after clearing
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="w-full flex items-end gap-2 glass rounded-2xl p-4 border border-gray-200 shadow-sm">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            "flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-24 overflow-y-auto",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
        />
        
        <Button 
          type="button" 
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="rounded-full p-2 h-10 w-10 flex items-center justify-center text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        >
          <Sun size={18} />
        </Button>
        
        <Button 
          type="submit" 
          disabled={!value.trim() || isDisabled}
          size="sm"
          className={cn(
            "rounded-full p-2 h-10 w-10 flex items-center justify-center transition-all bg-yellow-400 hover:bg-yellow-500 text-black",
            !value.trim() && "opacity-50"
          )}
        >
          <Zap size={18} />
        </Button>
      </div>
      
      <div className="text-xs text-center text-gray-500 mt-2">
        Our AI assistant provides solar energy advice and customer support. Click the sun for suggestions.
      </div>
    </motion.form>
  );
};

export default QueryInput;
