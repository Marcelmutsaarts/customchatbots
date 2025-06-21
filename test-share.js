// Test script om share functionaliteit te testen
const testConfig = {
  naam: "Test Geschiedenis Docent",
  vakkennis: "Nederlandse geschiedenis, met focus op de Gouden Eeuw en de Tweede Wereldoorlog. Ik kan complexe historische concepten uitleggen op verschillende niveaus.",
  didactischeRol: "Je bent een deskundige tutor die complexe concepten helder en stapsgewijs uitlegt. Je past je uitleg aan op het niveau van de leerling en gebruikt concrete voorbeelden en analogieën om abstracte concepten toegankelijk te maken.",
  pedagogischeStijl: "Je bent een warme, empathische begeleider die een veilige leeromgeving creëert. Je gebruikt bemoedigende taal en benadrukt wat goed gaat voordat je verbeterpunten aankaart."
};

console.log("Test configuratie:");
console.log(JSON.stringify(testConfig, null, 2));

// Test de share API
async function testShare() {
  try {
    const response = await fetch('http://localhost:3000/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Share response:", data);
    
    const shareUrl = `http://localhost:3000/chat/${data.id}`;
    console.log("Share URL:", shareUrl);
    
    // Test de chat config API
    const configResponse = await fetch(`http://localhost:3000/api/chat/${data.id}`);
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log("Retrieved config:", config);
    } else {
      console.error("Failed to retrieve config:", configResponse.status);
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Uncomment de volgende regel om de test uit te voeren:
// testShare();

console.log("\nOm deze test uit te voeren:");
console.log("1. Start de development server: npm run dev");
console.log("2. Uncomment de laatste regel in dit bestand");
console.log("3. Run: node test-share.js"); 