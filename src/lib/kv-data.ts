import { kv } from '@vercel/kv';

export interface ChatConfig {
  naam: string;
  vakkennis: string;
  didactischeRol: string;
  pedagogischeStijl: string;
}

/**
 * Haalt een chatbot-configuratie rechtstreeks op uit de Vercel KV-database.
 * @param id De unieke ID van de chatbot-configuratie.
 * @returns De configuratie als een object, of null als deze niet wordt gevonden.
 */
export async function getChatConfigFromKV(id: string): Promise<ChatConfig | null> {
  try {
    console.log(`[KV-DATA] Ophalen van configuratie voor key: chat:${id}`);
    const config = await kv.get<ChatConfig>(`chat:${id}`);
    
    if (!config) {
      console.warn(`[KV-DATA] Geen configuratie gevonden voor key: chat:${id}`);
      return null;
    }

    console.log(`[KV-DATA] Configuratie succesvol gevonden voor key: chat:${id}`);
    return config;
  } catch (error) {
    console.error(`[KV-DATA] Onverwachte fout bij ophalen uit KV voor ID ${id}:`, error);
    // In een productieomgeving zou je hier wellicht een robuustere foutafhandeling willen.
    return null;
  }
} 