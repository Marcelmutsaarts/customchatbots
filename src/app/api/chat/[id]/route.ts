import { getChatConfigFromKV } from '@/lib/kv-data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      console.error('[API/GET] Geen ID meegegeven in verzoek.')
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

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