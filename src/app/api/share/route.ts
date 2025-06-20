import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

// Helper functie om een unieke ID te genereren
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { vakkennis, vakdidaktiek, pedagogiek } = await request.json();

    // Valideer de input
    if (!vakkennis || !vakdidaktiek || !pedagogiek) {
      return NextResponse.json({ error: 'Alle drie de velden (vakkennis, vakdidaktiek, pedagogiek) zijn vereist.' }, { status: 400 });
    }

    // Genereer een unieke ID
    const id = generateId();

    // Definieer de configuratie
    const configuration = {
      vakkennis,
      vakdidaktiek,
      pedagogiek,
    };

    // Sla de configuratie op in Vercel KV
    // De key is `chat:ID`, wat een goede practice is om keys te groeperen.
    await kv.set(`chat:${id}`, configuration);

    // Stuur de gegenereerde ID terug naar de client
    return NextResponse.json({ id });

  } catch (error) {
    console.error('Fout bij het opslaan van de configuratie:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    return NextResponse.json({ error: 'Kon de configuratie niet opslaan.', details: errorMessage }, { status: 500 });
  }
} 