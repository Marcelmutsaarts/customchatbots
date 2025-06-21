'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatInterfaceProps {
  config: {
    naam?: string
    vakkennis: string
    didactischeRol: string
    pedagogischeStijl: string
  }
}

export default function ChatInterface({ config }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasChatStarted, setHasChatStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleStartChat = async () => {
    if (isLoading || hasChatStarted) return

    setIsLoading(true)
    setHasChatStarted(true)
    
    const startMessage = "Stel jezelf voor aan de hand van de Vakkennis. Geef een kort en vriendelijk welkom en leg uit hoe je kunt helpen. Bijvoorbeeld: 'Welkom! Ik kan je helpen met [onderwerp]. Ik kan [wat je kan doen].'";

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: startMessage,
          aiModel: 'smart',
          vakkennis: config.vakkennis,
          didactischeRol: config.didactischeRol,
          pedagogischeStijl: config.pedagogischeStijl
        }),
      })

      if (!response.ok) {
        throw new Error('Fout bij het starten van het gesprek')
      }

      const data = await response.json()
      addMessage(data.response, false)
    } catch (error) {
      console.error('Error:', error)
      addMessage('Sorry, er is een fout opgetreden bij het starten van het gesprek. Probeer het opnieuw.', false)
      setHasChatStarted(false)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')
    addMessage(userMessage, true)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          aiModel: 'smart',
          vakkennis: config.vakkennis,
          didactischeRol: config.didactischeRol,
          pedagogischeStijl: config.pedagogischeStijl
        }),
      })

      if (!response.ok) {
        throw new Error('Fout bij het versturen van het bericht')
      }

      const data = await response.json()
      addMessage(data.response, false)
    } catch (error) {
      console.error('Error:', error)
      addMessage('Sorry, er is een fout opgetreden. Probeer het opnieuw.', false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '500px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {!hasChatStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Klaar om te beginnen?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {config.naam || 'Je AI-assistent'} staat klaar om je te helpen! 
              Klik op de knop om een gesprek te starten en ontdek hoe ik je kan ondersteunen.
            </p>
            <button 
              onClick={handleStartChat}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Initialiseren...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Start het gesprek</span>
                  </>
                )}
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  } px-4 py-3`}
                >
                  {msg.isUser ? (
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                  ) : (
                    <MarkdownRenderer content={msg.content} className="text-sm leading-relaxed" />
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {hasChatStarted && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Stel je vraag hier..."
              className="flex-1 resize-none rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 text-sm transition-all duration-200"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-2">
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isLoading ? 'Versturen...' : 'Verstuur'}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 