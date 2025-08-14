let quoteDisplay = document.getElementById("quoteDisplay")
// const button = document.querySelector("#newQuote");

let quotes = [
    "You have power over your mind—not outside events. Realize this, and you will find strength.",
    "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.",
    "If it is not right, do not do it; if it is not true, do not say it.",
    "“Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.”"
    
];



function showRandomQuote(){
    var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];    
    quoteDisplay.innerHTML = randomQuote;
    console.log("I am happy")


}
showRandomQuote()

function addQuote(){
    
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