import { getChatConfigFromKV } from '@/lib/kv-data'
import { NextRequest, NextResponse } from 'next/server'

// Definieer het correcte type voor de context van de route handler,
// die de 'params' met de dynamische segmenten bevat.
type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  // Gebruik het correct gedefinieerde type voor de tweede parameter.
  { params }: RouteContext
) {
  try {
    const { id } = params
    
    if (!id) {
      console.error('[API/GET] Geen ID meegegeven in verzoek.')
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Gebruik de gecentraliseerde, directe data-ophalingsfunctie.
    const config = await getChatConfigFromKV(id)
    
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    return NextResponse.json(config)
  } catch (error) {
    const errorId = params?.id || 'onbekend'
    console.error(`[API/GET] Onverwachte fout opgetreden voor ID: ${errorId}`, error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
} 