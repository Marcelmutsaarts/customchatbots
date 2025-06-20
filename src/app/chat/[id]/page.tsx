import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import ChatClient from './ChatClient';

type PageProps = {
  params: { id: string };
};

type ChatConfig = {
  vakkennis: string;
  vakdidaktiek: string;
  pedagogiek: string;
};

async function getChatConfig(id: string): Promise<ChatConfig | null> {
  try {
    const config = await kv.get<ChatConfig>(`chat:${id}`);
    return config;
  } catch (error) {
    console.error('Kon de chat configuratie niet ophalen uit Vercel KV:', error);
    return null;
  }
}

export default async function SharedChatPage({ params }: PageProps) {
  const config = await getChatConfig(params.id);

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <header className="absolute top-0 left-0 right-0 p-4">
            <div className="flex items-center space-x-3 max-w-4xl mx-auto">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Voor Docenten</h1>
              </div>
            </div>
        </header>

      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-white rounded-xl shadow-2xl">
        <ChatClient config={config} />
      </div>

       <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p className="text-xs text-gray-500">
                Aangeboden door <a href="https://www.aivoordocenten.nl" target="_blank" rel="noopener noreferrer" className="font-medium text-purple-700 hover:underline">AI Voor Docenten</a>
            </p>
       </footer>
    </div>
  );
} 