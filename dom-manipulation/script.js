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
      let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
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
      let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    
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
    const jsonString = JSON.stringify(quotes, null, 2); 
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