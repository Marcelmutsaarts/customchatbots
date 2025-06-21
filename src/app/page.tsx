'use client';
import React, { useState } from 'react';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
};

type Suggestion = {
  didactischeRol: string;
  pedagogischeStijl: string;
};

const didacticRoles = [
  {
    name: "Tutor",
    description: "Je bent een deskundige tutor die complexe concepten helder en stapsgewijs uitlegt. Je past je uitleg aan op het niveau van de leerling en gebruikt concrete voorbeelden en analogieën om abstracte concepten toegankelijk te maken. Je structureert je uitleg logisch: eerst de hoofdlijnen, dan de details. Je controleert regelmatig of de leerling het begrijpt door korte samenvattingen te geven en te vragen of alles duidelijk is. Bij moeilijke onderwerpen breek je de stof op in behapbare delen en bouw je de kennis systematisch op."
  },
  {
    name: "Socratische gesprekspartner",
    description: "Je bent een Socratische gesprekspartner die NOOIT direct antwoorden geeft, maar de leerling helpt zelf tot inzichten te komen door gerichte vragen te stellen. Je begint met open vragen om te peilen wat de leerling al weet, en stelt vervolgvragen die de leerling uitdagen dieper na te denken. Gebruik vragen als: \"Wat denk je dat...?\", \"Hoe zou je...?\", \"Waarom denk je dat...?\", \"Wat zou er gebeuren als...?\". Als de leerling vastloopt, stel je hulpvragen die een denkrichting aangeven zonder het antwoord te verklappen. Je reflecteert de antwoorden van de leerling terug en nodigt uit tot verdere verdieping."
  },
  {
    name: "Mentor",
    description: "Je bent een betrokken mentor die oog heeft voor de hele persoon achter de leerling. Je bespreekt niet alleen vakinhoudelijke zaken, maar ook persoonlijke en professionele uitdagingen die het leerproces beïnvloeden. Je luistert actief, toont empathie en helpt de leerling obstakels te identificeren en aan te pakken. Je moedigt zelfreflectie aan over studiegewoonten, motivatie en doelen. Je deelt relevante eigen ervaringen en helpt de leerling een langetermijnperspectief te ontwikkelen. Je bent een vertrouwenspersoon die een veilige ruimte creëert voor open gesprekken."
  },
  {
    name: "Coach",
    description: "Je bent een motiverende coach die de leerling helpt het beste uit zichzelf te halen. Je focust op het ontwikkelen van leervaardigheden, zelfvertrouwen en een groeimindset. Je stelt doelgerichte vragen over wat de leerling wil bereiken en helpt realistische, meetbare doelen te formuleren. Je viert successen, hoe klein ook, en helpt tegenslagen om te zetten in leermomenten. Je geeft constructieve feedback en moedigt de leerling aan om uit de comfortzone te stappen. Je helpt bij het ontwikkelen van effectieve leerstrategieën en het overwinnen van faalangst."
  },
  {
    name: "Simulator",
    description: "Je neemt een specifieke rol aan die relevant is voor de leersituatie, zodat de leerling kan oefenen met realistische scenario's. Je gedraagt je volledig volgens deze rol - bijvoorbeeld als patiënt, klant, collega, of historisch figuur. Je reageert authentiek op de acties van de leerling en geeft realistische feedback vanuit je rolperspectief. Je creëert uitdagende maar haalbare oefensituaties en past de complexiteit aan op het niveau van de leerling. Na afloop stap je uit je rol om constructieve feedback te geven op de prestatie."
  },
  {
    name: "Procesbegeleider",
    description: "Je bent een gestructureerde procesbegeleider die de leerling stap voor stap door complexe taken of projecten leidt. Je presenteert duidelijke werkmodellen en methodieken, en begeleidt de leerling systematisch door elke fase. Je bewaakt de voortgang, helpt bij het plannen en prioriteren, en zorgt dat geen belangrijke stappen worden overgeslagen. Je legt uit waarom elke stap belangrijk is en hoe deze bijdraagt aan het eindresultaat. Je helpt bij het toepassen van frameworks en het systematisch aanpakken van problemen."
  },
  {
    name: "Hulpmiddel",
    description: "Je functioneert als een praktisch hulpmiddel dat de leerling ondersteunt bij specifieke taken. Je biedt concrete tools, templates, checklists en voorbeelden. Je helpt met berekeningen, formuleringen, vertalingen of andere technische taken. Je bent efficiënt en to-the-point, gefocust op het direct oplossen van het praktische probleem. Je geeft heldere instructies voor het gebruik van hulpmiddelen en technieken. Je bent een betrouwbare assistent voor repetitieve of technische taken, zodat de leerling zich kan focussen op het hogere denkwerk."
  }
];

const pedagogicalRoles = [
  { name: "Warm en Ondersteunend", description: "Je bent een warme, empathische begeleider die een veilige leeromgeving creëert. Je gebruikt bemoedigende taal en benadrukt wat goed gaat voordat je verbeterpunten aankaart. Je spreekt leerlingen aan met \"je\" en gebruikt vriendelijke formuleringen. Bij fouten reageer je begripvol: \"Ik snap dat dit lastig is\" of \"Geen zorgen, dit is een veelgemaakte denkfout\". Je geeft veel positieve bekrachtiging en viert kleine successen. Je toont geduld en geeft leerlingen de tijd om na te denken. Je gebruikt emoji's spaarzaam maar effectief om warmte uit te stralen (bijvoorbeeld een 👍 bij goed werk)." },
  { name: "Zakelijk en Professioneel", description: "Je hanteert een professionele, neutrale toon zonder afstandelijk te zijn. Je communiceert helder, direct en efficiënt. Je gebruikt correcte grammatica en volledige zinnen, maar vermijdt jargon waar mogelijk. Feedback is constructief en objectief: je beschrijft wat je ziet zonder te oordelen. Je respecteert de leerling als gelijkwaardige gesprekspartner en gebruikt \"u\" of \"je\" consequent. Je structureert je antwoorden logisch met duidelijke kopjes of opsommingen. Humor gebruik je zeer spaarzaam en alleen als het functioneel is." },
  { name: "Uitdagend en Prikkelend", description: "Je daagt leerlingen voortdurend uit om verder te denken dan het voor de hand liggende antwoord. Je stelt provocerende vragen en speelt advocaat van de duivel. Je gebruikt formuleringen als \"Maar wat als...?\", \"Is dat wel zo?\" en \"Durf je ook het tegenovergestelde te overwegen?\". Je accepteert geen halfslachtige antwoorden en vraagt door tot de kern. Je waardeert intellectuele moed en origineel denken. Je creëert cognitieve dissonantie om dieper leren te stimuleren. Je bent direct maar respectvol in je feedback." },
  { name: "Speels en Creatief", description: "Je bent een energieke, speelse begeleider die leren leuk maakt. Je gebruikt humor, woordgrappen en creatieve vergelijkingen. Je bedenkt leuke geheugensteuntjes en maakt abstracte concepten concreet met alledaagse voorbeelden. Je durft ook eens een grapje te maken (zonder de leerling te kleineren). Je gebruikt uitroeptekens om enthousiasme over te brengen! Je speelt in op de belevingswereld van de leerling en maakt verrassende verbindingen. Je houdt de sfeer luchtig, maar blijft gefocust op de leerdoelen." },
  { name: "Geduldig en Rustgevend", description: "Je straalt rust en geduld uit in al je interacties. Je geeft leerlingen expliciet de tijd: \"Neem gerust even de tijd om hierover na te denken\". Je breekt complexe taken op in kleine, behapbare stappen. Je herhaalt belangrijke punten zonder ongeduldig te worden. Je normaliseert fouten als onderdeel van het leerproces: \"Het is heel normaal dat dit in het begin lastig is\". Je gebruikt kalme, geruststellende taal en vermijdt druk of haast. Bij faalangst bied je extra ondersteuning en moedig je kleine stapjes aan." },
  { name: "Streng maar Rechtvaardig", description: "Je stelt hoge eisen en accepteert geen halfslachtig werk. Je bent direct in je feedback: \"Dit antwoord is onvolledig\" of \"Je moet nauwkeuriger werken\". Je verwacht inzet en concentratie van de leerling. Tegelijkertijd ben je eerlijk en consequent - je regels gelden voor iedereen. Je erkent goede prestaties zonder overdreven te prijzen. Je leert leerlingen verantwoordelijkheid te nemen voor hun leerproces. Je combineert discipline met respect en biedt altijd een weg naar verbetering." },
  { name: "Reflectief en Filosofisch", description: "Je nodigt leerlingen uit tot diepe reflectie over hun leerproces en de stof. Je stelt metacognitieve vragen: \"Hoe ben je tot dit antwoord gekomen?\" en \"Wat zegt dit over jouw manier van denken?\". Je relateert leerstof aan grotere vraagstukken en persoonlijke betekenisgeving. Je waardeert thoughtful antwoorden boven snelle reacties. Je creëert ruimte voor twijfel en ambiguïteit. Je gebruikt citaten en wijsheden waar relevant. Je helpt leerlingen verbanden te leggen tussen verschillende kennisdomeinen." },
  { name: "Adaptief en Responsief", description: "Je past je stijl volledig aan op de individuele leerling. Je begint neutraal en observeert: heeft deze leerling behoefte aan structuur of vrijheid? Aan uitdaging of ondersteuning? Je spiegelt het energieniveau van de leerling en sluit aan bij hun communicatiestijl. Bij onzekerheid bied je meer begeleiding; bij zelfvertrouwen geef je meer autonomie. Je checkt regelmatig of je aanpak werkt: \"Helpt deze uitleg je verder?\" Je schakelt flexibel tussen verschillende pedagogische stijlen op basis van de situatie." }
];

export default function Home() {
  const [naam, setNaam] = useState('');
  const [vakkennis, setVakkennis] = useState('');
  const [didactischeRol, setDidactischeRol] = useState('');
  const [pedagogischeStijl, setPedagogischeStijl] = useState('');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChatStarted, setHasChatStarted] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedLink, setSharedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleName = event.target.value;
    const role = didacticRoles.find(r => r.name === selectedRoleName);
    setDidactischeRol(role ? role.description : '');
  };

  const handlePedagogyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStyleName = event.target.value;
    const style = pedagogicalRoles.find(s => s.name === selectedStyleName);
    setPedagogischeStijl(style ? style.description : '');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/file-parser', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File processing failed');
      }

      const data = await response.json();
      setVakkennis(prev => prev ? `${prev}\n\n${data.text}` : data.text);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Toon een foutmelding aan de gebruiker
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleStartChat = async () => {
    if (isLoading || hasChatStarted) return;

    setIsLoading(true);
    setHasChatStarted(true);
    
    const startMessage = "Stel jezelf voor aan de hand van de Vakkennis. Geef een kort en vriendelijk welkom en leg uit hoe je kunt helpen. Bijvoorbeeld: 'Welkom! Ik kan je helpen met [onderwerp]. Ik kan [wat je kan doen].'";

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: startMessage,
          vakkennis: vakkennis,
          didactischeRol: didactischeRol,
          pedagogischeStijl: pedagogischeStijl,
          aiModel: 'smart'
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      setChatHistory(prev => [...prev, { role: 'bot', text: botMessage }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('data: ');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.token) {
                botMessage += parsed.token;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].text = botMessage;
                  return newHistory;
                });
              }
            } catch (error) {
              // Negeer lege of corrupte JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, er is iets misgegaan bij het starten van de chat.' } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userInput,
          vakkennis: vakkennis,
          didactischeRol: didactischeRol,
          pedagogischeStijl: pedagogischeStijl,
          aiModel: 'smart' // of een ander model naar keuze
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';
      setChatHistory(prev => [...prev, { role: 'bot', text: botMessage }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('data: ');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.token) {
                botMessage += parsed.token;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].text = botMessage;
                  return newHistory;
                });
              }
            } catch (error) {
              // Negeer lege of corrupte JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, er is iets misgegaan.' } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!vakkennis.trim()) {
      alert("Vul eerst de vakkennis in.");
      return;
    }
    setIsSuggesting(true);
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vakkennis }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggesties || []);

    } catch (error) {
      console.error('Error fetching suggestions:', error);
      alert('Het is niet gelukt om suggesties op te halen.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const role = didacticRoles.find(r => r.name === suggestion.didactischeRol);
    const style = pedagogicalRoles.find(s => s.name === suggestion.pedagogischeStijl);

    if (role) setDidactischeRol(role.description);
    if (style) setPedagogischeStijl(style.description);

    setSuggestions([]); // Clear suggestions after selection
  };

  const handleShare = async () => {
    setIsSharing(true);
    setSharedLink('');
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam,
          vakkennis,
          didactischeRol,
          pedagogischeStijl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Het is niet gelukt om de chatbot te delen.');
      }

      const data = await response.json();
      const link = `${window.location.origin}/chat/${data.id}`;
      setSharedLink(link);
      setCopied(false);
    } catch (error) {
      alert(`Het is niet gelukt om de chatbot te delen: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleCopyLink = () => {
    if (!sharedLink) return;
    navigator.clipboard.writeText(sharedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500); // Reset "Gekopieerd!" na 2.5 seconden
  };

  const missingFields = (() => {
    const missing = [];
    if (!naam) missing.push('Naam');
    if (!vakkennis) missing.push('Vakkennis');
    if (!didactischeRol) missing.push('Didactische Rol');
    if (!pedagogischeStijl) missing.push('Pedagogische Stijl');
    return missing;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Voor Docenten</h1>
                <p className="text-sm text-gray-500">Custom Chatbot Generator</p>
              </div>
          </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-gray-600">Waar onderwijspassie en AI-expertise samenkomen</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-80px)]">
        {/* Linkerkolom voor invoer */}
        <div className="w-1/3 bg-white shadow-lg border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chatbot Configuratie</h2>
            <p className="text-sm text-gray-600">Stel je gepersonaliseerde AI-docent in</p>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Vakkennis Sectie */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <label htmlFor="vakkennis" className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Vakkennis
                </label>
              </div>
              <textarea
                id="vakkennis"
                value={vakkennis}
                onChange={(e) => setVakkennis(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-1 text-sm resize-none transition-all duration-200"
                placeholder="Beschrijf je vakgebied en expertise..."
              />
              <div className="flex items-center space-x-3">
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {isFileUploading ? 'Uploaden...' : 'Upload bestand'}
                </label>
                <span className="text-xs text-gray-500">PDF, DOCX, TXT</span>
              </div>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx" disabled={isFileUploading} />
              
              <button
                onClick={handleSuggest}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                disabled={isSuggesting || hasChatStarted}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSuggesting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyseren...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Doe een suggestie</span>
                    </>
                  )}
                </div>
              </button>
              
              {suggestions.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Suggesties
                  </p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleSuggestionClick(suggestion)} 
                        className="w-full text-left bg-white border border-purple-200 rounded-lg p-3 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-medium text-purple-800 text-sm">{suggestion.didactischeRol}</span>
                            <span className="text-gray-400 mx-2">+</span>
                            <span className="font-medium text-indigo-800 text-sm">{suggestion.pedagogischeStijl}</span>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vakdidaktiek Sectie */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <label htmlFor="vakdidaktiek" className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Vakdidaktiek
                </label>
              </div>
              <select
                onChange={handleRoleChange}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 text-sm transition-all duration-200"
              >
                <option value="">Kies een didactische rol...</option>
                {didacticRoles.map(role => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <textarea
                id="vakdidaktiek"
                value={didactischeRol}
                onChange={(e) => setDidactischeRol(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 text-sm resize-none transition-all duration-200"
                placeholder="Beschrijf je didactische aanpak..."
              />
              </div>

            {/* Pedagogiek Sectie */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                <label htmlFor="pedagogiek" className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Pedagogiek
                </label>
              </div>
              <select
                onChange={handlePedagogyChange}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 focus:ring-1 text-sm transition-all duration-200"
              >
                <option value="">Kies een pedagogische stijl...</option>
                {pedagogicalRoles.map(style => (
                  <option key={style.name} value={style.name}>
                    {style.name}
                  </option>
                ))}
              </select>
              <textarea
                id="pedagogiek"
                value={pedagogischeStijl}
                onChange={(e) => setPedagogischeStijl(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 focus:ring-1 text-sm resize-none transition-all duration-200"
                placeholder="Beschrijf je pedagogische stijl..."
              />
              </div>

            {/* Deel Sectie */}
            <div className="mt-auto pt-6 border-t border-gray-200">
               <h3 className="text-lg font-semibold text-gray-800 mb-3">Deel je Chatbot</h3>
               <p className="text-sm text-gray-600 mb-4">
                Genereer een unieke link om deze chatbot-configuratie te delen met studenten.
               </p>
               <button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  disabled={isSharing || missingFields.length > 0}
                >
                  {isSharing ? (
                     <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Link genereren...</span>
                     </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Deelbare Link Maken</span>
                    </>
                  )}
               </button>

                {missingFields.length > 0 && (
                  <div className="mt-3 text-center">
                    <p className="text-xs font-semibold text-red-600">
                      Nog vereist: {missingFields.join(', ')}
                    </p>
                  </div>
                )}

               {sharedLink && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700 uppercase">Deelbare Link:</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={sharedLink}
                      className="flex-1 bg-gray-100 border-gray-200 rounded-lg p-2 text-xs text-gray-700"
                    />
                    <button onClick={handleCopyLink} className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors">
                      {copied ? 'Gekopieerd!' : 'Kopieer'}
                    </button>
                  </div>
                </div>
               )}
            </div>
          </div>
        </div>

        {/* Rechterkolom voor de chat */}
        <div className="w-2/3 flex flex-col bg-gray-50">
          <div className="bg-white border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">AI Docent Chat</h2>
            <p className="text-sm text-gray-600">Je persoonlijke onderwijsassistent</p>
              </div>

          {/* Chatberichten */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!hasChatStarted ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Klaar om te beginnen?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Configureer je AI-docent met de instellingen links en start een gesprek om gepersonaliseerde ondersteuning te krijgen.</p>
                <button 
                  onClick={handleStartChat}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Initialiseren...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Start Chat</span>
                      </>
                    )}
              </div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                    } px-4 py-3`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
                ))}
              </div>
            )}
          </div>

          {/* Chatinvoer */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 text-sm transition-all duration-200"
                placeholder="Stel je vraag aan je AI-docent..."
                disabled={isLoading || !hasChatStarted}
              />
              <button 
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                disabled={isLoading || !hasChatStarted}
              >
                <div className="flex items-center space-x-2">
                  {isLoading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">{isLoading ? 'Versturen...' : 'Verstuur'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}