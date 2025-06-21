import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

// Genereer een kortere, URL-vriendelijke ID
const generateId = () => nanoid(8);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API/SHARE] Request body ontvangen:', body);

    const { naam, vakkennis, didactischeRol, pedagogischeStijl } = body;

    // Valideer de input
    if (!naam || !vakkennis || !didactischeRol || !pedagogischeStijl) {
      console.error('[API/SHARE] Validatie mislukt: ontbrekende velden.');
      return NextResponse.json({ error: 'Alle velden zijn vereist.' }, { status: 400 });
    }

    // Genereer een unieke ID
    const id = generateId();
    console.log(`[API/SHARE] Nieuwe ID gegenereerd: ${id}`);

    // Definieer de configuratie
    const configuration = {
      naam,
      vakkennis,
      didactischeRol,
      pedagogischeStijl,
    };

    // Sla de configuratie op in Vercel KV
    console.log(`[API/SHARE] Bezig met opslaan van configuratie voor key: chat:${id}`);
    await kv.set(`chat:${id}`, configuration);
    console.log(`[API/SHARE] Configuratie succesvol opgeslagen voor key: chat:${id}`);

    // Stuur de gegenereerde ID terug naar de client
    return NextResponse.json({ id });

  } catch (error) {
    console.error('[API/SHARE] Onverwachte fout opgetreden:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    return NextResponse.json({ error: 'Kon de configuratie niet opslaan.', details: errorMessage }, { status: 500 });
  }
} 