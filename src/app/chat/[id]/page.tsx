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