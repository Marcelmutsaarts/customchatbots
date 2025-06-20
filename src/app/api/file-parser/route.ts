import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file.type.startsWith('text/')) {
      text = buffer.toString('utf8');
    } else {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error parsing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to parse file.', details: errorMessage }, { status: 500 });
  }
} 