import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MessagesSquare, Send, X } from 'lucide-react';
import api from '@/services/api';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

export function AARAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm AAR AI, your learning assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Call the AI API
      const response = await api.post('/api/ai/chat', { message });
      
      // Add AI response to the chat
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.data.message,
        role: 'assistant',
        timestamp: response.data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Add error message if API call fails
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble connecting to my neural network. Please try again later.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg"
            size="icon"
          >
            <MessagesSquare />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90vw] sm:max-w-[400px] p-0 flex flex-col h-[80vh] sm:h-[600px]">
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center">
                <div className="bg-turquoise rounded-full p-1 mr-2">
                  <img
                    src="https://i.pinimg.com/originals/0c/67/5a/0c675a8e1061478d2b7b21b330093444.gif"
                    alt="AAR AI Logo"
                    className="h-6 w-6 object-cover rounded-full"
                  />
                </div>
                AAR AI Assistant
              </SheetTitle>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <SheetFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                className="flex-1"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <Button size="icon" onClick={sendMessage} disabled={!message.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
