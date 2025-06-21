import { getChatConfigFromKV } from '@/lib/kv-data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params
    
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
    console.error(`[API/GET] Onverwachte fout opgetreden`, error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
} 