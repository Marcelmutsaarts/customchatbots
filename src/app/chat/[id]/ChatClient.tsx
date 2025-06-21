'use client';

import React, { useState, useEffect, useRef } from 'react';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
};

type ChatConfig = {
  vakkennis: string;
  vakdidaktiek: string;
  pedagogiek: string;
};

export default function ChatClient({ config }: { config: ChatConfig }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleStartChat = async () => {
    setIsLoading(true);
    
    const startMessage = "Stel jezelf voor aan de hand van de Vakkennis. Geef een kort en vriendelijk welkom en leg uit hoe je kunt helpen. Bijvoorbeeld: 'Welkom! Ik kan je helpen met [onderwerp]. Ik kan [wat je kan doen].'";

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: startMessage,
          ...config,
          aiModel: 'smart'
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      setChatHistory(prev => [...prev, { role: 'bot', text: botMessage }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('data: ');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.token) {
                botMessage += parsed.token;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].text = botMessage;
                  return newHistory;
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, er is iets misgegaan bij het starten van de chat.' } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    try {
      // Bouw conversatiegeschiedenis op in het juiste formaat voor Gemini
      const conversationHistory = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))

      // Voeg het nieuwe bericht toe
      conversationHistory.push({
        role: 'user',
        parts: [{ text: userInput }]
      })

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput,
          conversationHistory: conversationHistory, // Voeg conversatiegeschiedenis toe
          ...config,
          aiModel: 'smart'
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      setChatHistory(prev => [...prev, { role: 'bot', text: botMessage }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('data: ');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.token) {
                botMessage += parsed.token;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].text = botMessage;
                  return newHistory;
                });
              }
            } catch (e) {
                // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, er is iets misgegaan.' } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleStartChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-6 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Gepersonaliseerde AI Docent</h2>
        <p className="text-sm text-gray-600">Deze chatbot is speciaal voor jou ingesteld.</p>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
            {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                } px-4 py-3`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
            </div>
            ))}
            {isLoading && chatHistory.length > 0 && (
                <div className="flex justify-start">
                     <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4 rounded-b-xl">
        <div className="flex space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 text-sm transition-all duration-200"
            placeholder="Stel je vraag..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              <span className="hidden sm:inline">Verstuur</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
} 