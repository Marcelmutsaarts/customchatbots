// @ts-nocheck
import { notFound } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'

type Props = {
  params: Promise<{ id: string }>
}

async function getChatConfig(id: string) {
  try {
    // In server-side rendering, gebruik een absolute URL voor fetch
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    console.log(`Fetching config from: ${baseUrl}/api/chat/${id}`)
    
    const response = await fetch(`${baseUrl}/api/chat/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch config for ID ${id}: ${response.status} ${response.statusText}`)
      return null
    }
    
    const config = await response.json()
    console.log(`Config fetched successfully for ID ${id}:`, config)
    return config
  } catch (error) {
    console.error('Error fetching chat config:', error)
    return null
  }
}

export default async function SharedChatPage({ params }: Props) {
  const { id } = await params
  console.log(`SharedChatPage rendering for ID: ${id}`)
  
  const config = await getChatConfig(id)
  
  if (!config) {
    console.log(`No config found for ID ${id}, showing 404`)
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