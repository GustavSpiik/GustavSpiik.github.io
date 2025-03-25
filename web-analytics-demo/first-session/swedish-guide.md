# GitHub Pages med VS Code: Inställningsguide för Webbanalys

Denna guide kommer att gå igenom processen för att sätta upp en GitHub Pages-webbplats med VS Code där studenter kan experimentera med dataLayer-objektet för webbanalys.

## Förutsättningar

- [GitHub-konto](https://github.com/join)
- [Git installerat](https://git-scm.com/downloads)
- [Visual Studio Code installerat](https://code.visualstudio.com/download)
- Grundläggande förståelse av HTML, JavaScript och Git

## Steg 1: Installera viktiga VS Code-tillägg

1. Öppna VS Code
2. Gå till Tillägg (Ctrl+Shift+X eller Cmd+Shift+X på Mac)
3. Installera följande tillägg:
   - **GitHub Pull Requests and Issues**
   - **Live Server**
   - **Git History**
   - **GitLens**

## Steg 2: Skapa ett nytt GitHub-repository

1. Gå till [GitHub](https://github.com/) och logga in
2. Klicka på "+" knappen i övre högra hörnet och välj "New repository"
3. Namnge ditt repository: `web-analytics-demo` (eller ett annat namn du föredrar)
4. Markera "Add a README file"
5. Klicka på "Create repository"

## Steg 3: Klona repositoryt i VS Code

1. I VS Code, tryck på Ctrl+Shift+P (eller Cmd+Shift+P på Mac) för att öppna kommandopaletten
2. Skriv "Git: Clone" och välj det
3. Klistra in din repository-URL (t.ex. `https://github.com/dittanvändarnamn/web-analytics-demo.git`)
4. Välj en lokal mapp för att lagra ditt projekt
5. När du uppmanas, öppna det klonade repositoryt

## Steg 4: Skapa grundläggande webbplatsstruktur för dataLayer-implementering

1. I VS Code, skapa följande filer i din projektmapp:
   - `index.html` (huvudsida)
   - `js/analytics.js` (för dataLayer-kod)
   - `css/styles.css` (grundläggande styling)

2. Lägg till grundläggande HTML-struktur i `index.html`:

```html
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Analytics Demo</title>
    <link rel="stylesheet" href="css/styles.css">
    
    <!-- Initialisera dataLayer -->
    <script>
        window.dataLayer = window.dataLayer || [];
    </script>
    
    <!-- Analytics Script (ladda före sidinnehåll) -->
    <script src="js/analytics.js"></script>
</head>
<body>
    <header>
        <h1>Web Analytics Demo</h1>
        <nav>
            <ul>
                <li><a href="#" id="home-link">Hem</a></li>
                <li><a href="#" id="products-link">Produkter</a></li>
                <li><a href="#" id="about-link">Om oss</a></li>
                <li><a href="#" id="contact-link">Kontakt</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>Välkommen till vår dataLayer-demo</h2>
            <p>Denna sida demonstrerar hur man använder dataLayer för webbanalys.</p>
            <button id="cta-button">Klicka här!</button>
        </section>
        
        <section id="products">
            <h2>Produkter</h2>
            <div class="product-grid">
                <div class="product" data-product-id="123" data-product-name="Produkt A" data-product-price="19.99">
                    <h3>Produkt A</h3>
                    <p>199 kr</p>
                    <button class="add-to-cart">Lägg i kundvagn</button>
                </div>
                <div class="product" data-product-id="456" data-product-name="Produkt B" data-product-price="29.99">
                    <h3>Produkt B</h3>
                    <p>299 kr</p>
                    <button class="add-to-cart">Lägg i kundvagn</button>
                </div>
                <div class="product" data-product-id="789" data-product-name="Produkt C" data-product-price="39.99">
                    <h3>Produkt C</h3>
                    <p>399 kr</p>
                    <button class="add-to-cart">Lägg i kundvagn</button>
                </div>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Web Analytics Demo</p>
    </footer>
</body>
</html>
```

3. Lägg till grundläggande CSS i `css/styles.css`:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    margin-bottom: 30px;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-right: 20px;
}

nav ul li a {
    text-decoration: none;
    color: #333;
}

section {
    margin-bottom: 40px;
}

button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.product {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
}

footer {
    margin-top: 50px;
    text-align: center;
}
```

4. Lägg till dataLayer-implementering i `js/analytics.js`:

```javascript
// dataLayer hjälpfunktion
function pushToDataLayer(event, data) {
    window.dataLayer.push({
        event: event,
        ...data,
        timestamp: new Date().toISOString()
    });
    
    // Logga till konsolen i demonstrationssyfte
    console.log('dataLayer Push:', {
        event: event,
        ...data,
        timestamp: new Date().toISOString()
    });
}

// Sidvisningsspårning
document.addEventListener('DOMContentLoaded', function() {
    pushToDataLayer('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
    
    // Spåra navigationsklick
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Förhindra faktisk navigering för demo
            
            pushToDataLayer('navigation_click', {
                link_id: this.id,
                link_text: this.textContent,
                link_url: this.href
            });
        });
    });
    
    // Spåra CTA-knappklick
    document.getElementById('cta-button').addEventListener('click', function() {
        pushToDataLayer('cta_click', {
            button_id: 'cta-button',
            button_text: this.textContent
        });
    });
    
    // Spåra produktinteraktioner
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            
            pushToDataLayer('add_to_cart', {
                product_id: product.dataset.productId,
                product_name: product.dataset.productName,
                product_price: parseFloat(product.dataset.productPrice),
                currency: 'SEK'
            });
        });
    });
});

// Exempel på hur man kommer åt dataLayer-data
window.showDataLayerHistory = function() {
    console.table(window.dataLayer);
};
```

## Steg 5: Testa webbplatsen lokalt

1. I VS Code, högerklicka på `index.html` och välj "Open with Live Server"
2. Din standardwebbläsare bör öppnas med webbplatsen
3. Öppna webbläsarens konsol (F12 eller högerklicka → Inspektera → Konsol)
4. Interagera med sidelementen och observera dataLayer-händelserna i konsolen
5. Prova att köra `window.showDataLayerHistory()` i konsolen för att se alla registrerade händelser

## Steg 6: Commita och pusha till GitHub

1. I VS Code, klicka på källkontrollikonen i sidofältet (eller tryck Ctrl+Shift+G)
2. Stage alla ändringar genom att klicka på "+" bredvid varje fil eller "+" bredvid "Changes"
3. Ange ett commit-meddelande, t.ex. "Initial commit med dataLayer-implementering"
4. Klicka på bockikonen för att commita
5. Klicka på "..." menyn och välj "Push" för att pusha dina ändringar till GitHub

## Steg 7: Aktivera GitHub Pages

1. Gå till ditt repository på GitHub
2. Klicka på "Settings"
3. Scrolla ner till avsnittet "GitHub Pages"
4. Under "Source", välj "main"-grenen
5. Klicka på "Save"
6. GitHub kommer att tillhandahålla en URL där din sida publiceras (vanligtvis i formatet `https://dittanvändarnamn.github.io/web-analytics-demo/`)
7. Vänta några minuter tills sidan har publicerats

## Steg 8: Besök den publicerade webbplatsen

1. När GitHub Pages har slutfört distributionen av din webbplats, besök den tillhandahållna URL:en
2. Verifiera att allt fungerar som förväntat
3. Dela URL:en med dina studenter

## Ytterligare uppgifter för studenter

Här är några övningar som studenter kan utföra för att bättre förstå dataLayer:

1. **Lägg till spårning av användarinteraktioner**:
   - Utöka analytics.js-filen för att spåra ytterligare användarinteraktioner
   - Implementera formulärinskickningar med dataLayer-händelser
   - Spåra scrolldjup

2. **Implementera e-handelsspårning**:
   - Lägg till ett kasaflöde med flera steg
   - Spåra varje steg i kassaprocessen
   - Implementera spårning av köpbekräftelse

3. **Skapa en enkel analyskontrollpanel**:
   - Lägg till en ny sida som visar insamlade dataLayer-händelser
   - Visualisera händelsefrekvens med ett enkelt diagram
   - Tillåt filtrering av händelser efter typ

4. **Utöka med tagghantering**:
   - Integrera med Google Tag Manager
   - Konfigurera anpassade utlösare baserade på dataLayer-händelser
   - Konfigurera taggar att aktiveras baserat på specifika villkor

## Felsökning av vanliga problem

1. **Ändringar visas inte på GitHub Pages**:
   - GitHub Pages kan ta några minuter att uppdatera
   - Kontrollera att du har pushat alla ändringar till 'main'-grenen
   - Verifiera GitHub Pages-inställningarna i repository-inställningarna

2. **dataLayer fungerar inte**:
   - Kontrollera webbläsarens konsol för JavaScript-fel
   - Verifiera att dataLayer initieras innan några händelser läggs till
   - Se till att analytics.js-filen laddas korrekt

3. **VS Code Git-problem**:
   - Se till att Git är installerat och konfigurerat korrekt
   - Kontrollera att dina GitHub-uppgifter är konfigurerade i VS Code
   - Prova att använda terminalen för Git-kommandon om GUI:n inte fungerar

## Slutsats

Denna installation ger en solid grund för att experimentera med dataLayer-objektet i en kontrollerad miljö. Studenter kan göra ändringar i sina lokala kopior, testa dem med Live Server och sedan pusha dessa ändringar till GitHub för att se dem live på sin GitHub Pages-webbplats.

dataLayer-implementeringen som ingår i denna guide fångar grundläggande interaktioner som sidvisningar, navigationsklick och produktinteraktioner. Studenter kan bygga vidare på denna grund för att utforska mer komplexa spårningsscenarier och få en djupare förståelse för hur webbanalys fungerar i praktiken.