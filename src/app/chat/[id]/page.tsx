// @ts-nocheck
import { notFound } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'
import { getChatConfigFromKV } from '@/lib/kv-data'

type Props = {
  // In Next.js 15 zijn params een Promise geworden
  params: Promise<{ id: string }>
}

export default async function SharedChatPage({ params }: Props) {
  const { id } = await params
  console.log(`SharedChatPage wordt gerenderd voor ID: ${id}`)
  
  // Roep de data direct aan via de gecentraliseerde functie, geen onbetrouwbare fetch meer.
  const config = await getChatConfigFromKV(id)
  
  if (!config) {
    console.log(`Geen configuratie gevonden voor ID ${id}, toon 404 pagina.`)
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Eenvoudige header voor studenten */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {config.naam || 'AI Leerassistent'}
          </h1>
          <p className="text-gray-600">
            Je persoonlijke AI-assistent staat klaar om je te helpen
          </p>
        </div>
        
        {/* Chat Interface */}
        <ChatInterface config={config} />
      </div>
    </div>
  )
} 