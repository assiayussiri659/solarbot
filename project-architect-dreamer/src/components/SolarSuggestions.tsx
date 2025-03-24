
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Leaf, Lightbulb } from 'lucide-react';

interface SolarSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const SolarSuggestions: React.FC<SolarSuggestionsProps> = ({ onSelectSuggestion }) => {
  const suggestions = [
    { icon: <Sun size={16} />, text: "How much can I save with solar panels?" },
    { icon: <Zap size={16} />, text: "What solar incentives are available in my area?" },
    { icon: <Leaf size={16} />, text: "What maintenance do solar panels require?" },
    { icon: <Lightbulb size={16} />, text: "How long do solar panels last?" }
  ];

  return (
    <motion.div 
      className="mb-4 p-2 bg-yellow-50 rounded-xl border border-yellow-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-medium text-yellow-800 mb-2 px-2">Popular Solar Energy Questions</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion.text)}
            className="flex items-center gap-2 p-2 text-left text-sm hover:bg-yellow-100 rounded-lg transition-colors text-gray-700 hover:text-black"
          >
            <span className="flex-shrink-0 text-yellow-600">{suggestion.icon}</span>
            <span className="truncate">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SolarSuggestions;
