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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {config.naam || 'AI Docent'}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-semibold text-blue-800">Vakkennis</span>
                  </div>
                  <p className="text-blue-700 text-xs leading-relaxed">{config.vakkennis}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="font-semibold text-indigo-800">Didactische rol</span>
                  </div>
                  <p className="text-indigo-700 text-xs leading-relaxed">{config.didactischeRol}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-semibold text-purple-800">Pedagogische stijl</span>
                  </div>
                  <p className="text-purple-700 text-xs leading-relaxed">{config.pedagogischeStijl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Interface */}
        <ChatInterface config={config} />
      </div>
    </div>
  )
} 