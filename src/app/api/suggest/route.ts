import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Definieer de rollen en stijlen hier zodat de AI weet waaruit hij moet kiezen
const didacticRoles = ["Tutor", "Socratische gesprekspartner", "Mentor", "Coach", "Simulator", "Procesbegeleider", "Hulpmiddel"];
const pedagogicalStyles = ["Warm en Ondersteunend", "Zakelijk en Professioneel", "Uitdagend en Prikkelend", "Speels en Creatief", "Geduldig en Rustgevend", "Streng maar Rechtvaardig", "Reflectief en Filosofisch", "Adaptief en Responsief"];

export async function POST(request: NextRequest) {
  try {
    const { vakkennis } = await request.json();

    if (!vakkennis) {
      return NextResponse.json({ error: 'Vakkennis is vereist.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-05-20',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Analyseer de volgende "vakkennis" voor een educatieve chatbot:
      ---
      ${vakkennis}
      ---
      Kies op basis van deze vakkennis de 3 meest logische combinaties van een didactische rol en een pedagogische stijl uit de onderstaande lijsten. Rangschik ze van meest naar minst geschikt.
      Geef alleen een JSON-object terug met de sleutel "suggesties", waarvan de waarde een array is van 3 objecten. Elk object moet de sleutels "didactischeRol" en "pedagogischeStijl" bevatten.

      Didactische Rollen: ${didacticRoles.join(", ")}
      Pedagogische Stijlen: ${pedagogicalStyles.join(", ")}

      Voorbeeld output:
      {
        "suggesties": [
          { "didactischeRol": "Tutor", "pedagogischeStijl": "Warm en Ondersteunend" },
          { "didactischeRol": "Coach", "pedagogischeStijl": "Geduldig en Rustgevend" },
          { "didactischeRol": "Socratische gesprekspartner", "pedagogischeStijl": "Uitdagend en Prikkelend" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const suggestions = JSON.parse(responseText);
    
    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Kon geen suggesties genereren.', details: errorMessage }, { status: 500 });
  }
} 