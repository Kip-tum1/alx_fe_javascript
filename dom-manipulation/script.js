let quoteDisplay = document.getElementById("quoteDisplay")
// const button = document.querySelector("#newQuote");

let quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        category: "Inspiration"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        category: "Life"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        category: "Dreams"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        category: "Innovation"
    }
    
];



function showRandomQuote(){
    let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];    
    quoteDisplay.innerHTML = [`"${randomQuote.text}" - ${randomQuote.category}`];
    


}

function createAddQuoteForm(){
    // let quote = JSON.parse(localStorage.getItem('quotes') || '[]');
    const input = document.createElement("input");
    const inputCategory = document.createElement("input");
    const button = document.createElement("button")    
    input.innerHTML = "text"
    button.innerHTML = "ADD"
    quoteDisplay.appendChild(input);
    quoteDisplay.appendChild(inputCategory);
    quoteDisplay.appendChild(button)

    button.addEventListener("click", () =>{
        if (input && inputCategory) {
        const quoteDisplay = document.getElementById('input-category');
        quoteDisplay.innerHTML = `"${input.value}"<br><small>- Category: ${inputCategory.value}</small>`;
        quoteDisplay.style.display = 'block';
    } else {
        alert('Please enter both quote text and category!');
    }
    })


}
showRandomQuote()
createAddQuoteForm()

function addQuote(){
      let quotes = JSON.parse(localStorage.setItem('quotes') || '[]');
    
    const quoteText = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && category) {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = `"${quoteText}"<br><small>- Category: ${category}</small>`;
        outputDiv.style.display = 'block';
    } else {
        alert('Please enter both quote text and category!');
    }

    
}

// Implement JSON Export:

function exportFromJsonFile(){
    const quote = [
        { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { id: 2, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { id: 3, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
    ];
    const jsonString = JSON.stringify(quote, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Create an URL

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";

    document.body.append(a);



}

// Implement JSON Import:

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function populateCategories(quotes) {
    const categories = [... new Set (quotes.map(quote => quote.category))];
    const categorys = document.getElementById("categoryFilter");
    categorys.innerHTML = "";

    const option = document.querySelector("#categoryFilters");
    categorys.appendChild(option);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);

    })
    // let randomCategory = quotes[Math.floor(Math.random() * quotes.length)];
    // categories.innerHTML = randomCategory.category;
    // categories.appendChild(randomCategory);


}

populateCategories(quotes);

function filterQuotes(selectedCategory) {
        // Get the quote display element
    const quoteDisplay = document.getElementById('quoteDisplay');
            
    // Filter quotes based on selected category
    const filteredQuotes = selectedCategory === 'all'? quotes: quotes.filter(quote => quote.category === selectedCategory);
    // Update the display
    quoteDisplay.innerHTML = filteredQuotes.length > 0 ? filteredQuotes.map(quote => `<div class="quote">${quote.text}</div>`).join('')
    : '<div class="quote">No quotes found for this category.</div>';
            
    // Save selected category to local storage
    localStorage.setItem('selectedCategory', selectedCategory); 
    // Get the quote display element
    
    
}

filterQuotes(selectedCategory);

async function syncQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: quote.id, title: quote.text, body: quote.category, timestamp: quote.timestamp })
        });
        if (response.ok) {
            showNotification('Quote synced to server successfully!');
        } else {
            showNotification('Failed to sync quote to server.', 'error');
        }
    } catch (error) {
        showNotification('Error syncing with server.', 'error');
    }
}

// Fetch quotes from server and sync
async function syncWithServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const serverQuotes = await response.json();
        const mappedQuotes = serverQuotes.map(q => ({
            id: q.id,
            text: q.title,
            category: q.body,
            timestamp: q.timestamp || new Date().toISOString()
        }));

        // Conflict detection and resolution
        const conflicts = [];
        const localQuoteIds = new Set(quotes.map(q => q.id));
        const serverQuoteIds = new Set(mappedQuotes.map(q => q.id));

        // Find conflicts (same ID, different content)
        for (const serverQuote of mappedQuotes) {
            const localQuote = quotes.find(q => q.id === serverQuote.id);
            if (localQuote && (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category)) {
                conflicts.push({ local: localQuote, server: serverQuote });
            }
        }

        if (conflicts.length > 0) {
            showConflictModal(conflicts);
        } else {
            // Merge quotes (server precedence)
            quotes = [
                ...quotes.filter(q => !serverQuoteIds.has(q.id)), // Keep local quotes not on server
                ...mappedQuotes // Add server quotes
            ];
            saveQuotes();
            populateCategories();
            showRandomQuote();
            localStorage.setItem('lastSyncTime', new Date().toISOString());
            showNotification('Data synced successfully with server!');
        }
    } catch (error) {
        showNotification('Error fetching data from server.', 'error');
    }
}

// Show conflict resolution modal
function showConflictModal(conflicts) {
    const modal = document.getElementById('conflictModal');
    const message = document.getElementById('conflictMessage');
    message.textContent = `Found ${conflicts.length} conflicting quotes. Choose to keep server or local data, or cancel to resolve later.`;
    modal.classList.remove('hidden');

    // Event listeners for conflict resolution
    const useServer = document.getElementById('useServer');
    const useLocal = document.getElementById('useLocal');
    const cancel = document.getElementById('cancelConflict');

    const resolve = (strategy) => {
        if (strategy === 'server') {
            conflicts.forEach(conflict => {
                const index = quotes.findIndex(q => q.id === conflict.local.id);
                quotes[index] = conflict.server;
            });
            showNotification('Conflicts resolved using server data.');
        } else if (strategy === 'local') {
            // Keep local data, no changes needed
            showNotification('Conflicts resolved using local data.');
        }
        saveQuotes();
        populateCategories();
        showRandomQuote();
        modal.classList.add('hidden');
    };

    useServer.onclick = () => resolve('server');
    useLocal.onclick = () => resolve('local');
    cancel.onclick = () => {
        modal.classList.add('hidden');
        showNotification('Conflict resolution cancelled.');
    };
}

// Periodic sync (every 30 seconds)
function startPeriodicSync() {
    syncWithServer();
    setInterval(syncWithServer, 30000);
}

// Initialize the app
function init() {
    populateCategories();
    showRandomQuote();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    document.getElementById('manualSync').addEventListener('click', syncWithServer);
    startPeriodicSync();
}

// Run initialization
init();