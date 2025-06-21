import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`[API/GET] Verzoek ontvangen voor ID: ${id}`)
    
    if (!id) {
      console.error('[API/GET] Geen ID meegegeven in verzoek.')
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Haal de configuratie op uit Vercel KV
    console.log(`[API/GET] Bezig met ophalen van config voor key: chat:${id}`)
    const config = await kv.get(`chat:${id}`)
    
    if (!config) {
      console.warn(`[API/GET] Geen configuratie gevonden voor key: chat:${id}`)
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    console.log(`[API/GET] Configuratie succesvol gevonden voor key: chat:${id}`, config)
    return NextResponse.json(config)
  } catch (error) {
    let errorId = 'onbekend';
    try {
      const p = await params;
      errorId = p.id;
    } catch (e) {
      // Kan id niet resolven
    }
    console.error(`[API/GET] Onverwachte fout opgetreden voor ID: ${errorId}`, error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
} 