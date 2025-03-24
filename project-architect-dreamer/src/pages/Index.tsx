
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-6 overflow-hidden">
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Solar Energy Support
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Intelligent Solar Energy Assistance
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm">
            Our AI analyzes your solar energy questions and provides personalized advice on installation, 
            savings, and maintenance for your renewable energy journey.
          </p>
        </motion.div>
        
        <div className="flex-1 flex items-start justify-center">
          <ChatInterface />
        </div>
      </main>
      
      <motion.footer 
        className="py-4 text-center text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>Solar energy support powered by AI with human expert escalation capabilities</p>
      </motion.footer>
    </div>
  );
};

export default Index;
