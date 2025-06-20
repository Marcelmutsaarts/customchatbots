import { notFound } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'

async function getChatConfig(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chat/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching chat config:', error)
    return null
  }
}

export default async function SharedChatPage({ params }) {
  const { id } = await params
  
  const config = await getChatConfig(id)
  
  if (!config) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {config.naam || 'Chatbot'}
          </h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Vakkennis:</strong> {config.vakkennis}</p>
            <p><strong>Didactische rol:</strong> {config.didactischeRol}</p>
            <p><strong>Pedagogische stijl:</strong> {config.pedagogischeStijl}</p>
          </div>
        </div>
        
        <ChatInterface config={config} />
      </div>
    </div>
  )
} 