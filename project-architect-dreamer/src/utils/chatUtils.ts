
import { toast } from "@/components/ui/use-toast";

// Message types
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sentimentScore?: number;
  escalationScore?: number;
  isLoading?: boolean;
}

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  currentQuery: string;
  feedbackGiven: boolean;
}

// Simple mock sentiment analysis (would be replaced with real API)
export const analyzeSentiment = (text: string): { 
  sentimentScore: number; 
  escalationScore: number;
} => {
  // This is a simplified mock implementation
  // In a real app, this would call an API
  
  // Check for negative words as a simple proxy for sentiment
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 
    'frustrated', 'disappointed', 'problem', 'issue', 'error', 'broken', 'not working'];
  
  // Check for escalation indicators
  const escalationWords = ['speak', 'manager', 'supervisor', 'human', 'person', 
    'agent', 'refund', 'complaint', 'immediately', 'urgent', 'frustrated', 'demand'];
  
  const lowerText = text.toLowerCase();
  
  // Count negative words
  let negativityCount = 0;
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativityCount++;
  });
  
  // Count escalation words
  let escalationCount = 0;
  escalationWords.forEach(word => {
    if (lowerText.includes(word)) escalationCount++;
  });
  
  // Calculate scores (0-100)
  const sentimentScore = Math.max(0, 100 - (negativityCount * 15));
  const escalationScore = Math.min(100, escalationCount * 25);
  
  return { sentimentScore, escalationScore };
};

// Mock function to simulate knowledge base query
export const queryKnowledgeBase = async (query: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple pattern matching for demo purposes
  // In a real implementation, this would be a sophisticated search
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
    return "Our return policy allows returns within 30 days of purchase. You can initiate a return through your account dashboard or contact customer support for assistance.";
  } else if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
    return "Standard shipping takes 3-5 business days. Express shipping is available for an additional fee and delivers within 1-2 business days. International shipping times vary by destination.";
  } else if (lowerQuery.includes('password') || lowerQuery.includes('login')) {
    return "You can reset your password by clicking the 'Forgot Password' link on the login page. A password reset link will be sent to your registered email address.";
  } else if (lowerQuery.includes('cancel') || lowerQuery.includes('subscription')) {
    return "To cancel your subscription, go to Account Settings > Subscriptions and click the 'Cancel Subscription' button. Your subscription will remain active until the end of the current billing cycle.";
  } else if (lowerQuery.includes('payment') || lowerQuery.includes('billing')) {
    return "We accept major credit cards, PayPal, and Apple Pay. Billing occurs at the beginning of each subscription period. You can update your payment method in Account Settings > Payment Methods.";
  } else {
    return "I don't have a specific answer for that question. For more detailed assistance, please provide additional information about your query.";
  }
};

// Generate a response based on query and sentiment
export const generateResponse = async (query: string): Promise<Message> => {
  try {
    // Analyze sentiment and escalation
    const { sentimentScore, escalationScore } = analyzeSentiment(query);
    
    let response = "";
    
    // Decide if this should be escalated
    if (escalationScore > 70) {
      response = "I understand this is important to you. I'm connecting you with a customer service representative who can better assist with your specific situation. Your case number is #" + Math.floor(10000 + Math.random() * 90000) + ". A representative will contact you shortly.";
    } else {
      // Query the knowledge base
      response = await queryKnowledgeBase(query);
    }
    
    return {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      sentimentScore,
      escalationScore
    };
  } catch (error) {
    console.error('Error generating response:', error);
    toast({
      title: "Error",
      description: "Failed to generate a response. Please try again.",
      variant: "destructive",
    });
    
    return {
      id: generateId(),
      role: 'assistant',
      content: "I'm sorry, I encountered an error while processing your request. Please try again.",
      timestamp: new Date(),
    };
  }
};

// Generate unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
