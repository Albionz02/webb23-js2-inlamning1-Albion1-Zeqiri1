let playerScore = 0;
let playerName = "";

async function getHighscores() {
    const url = 'http://localhost:3000/api/highscores';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network not response');
        }
        const highscores = await response.json();
        return highscores;
    } catch (error) {
        console.error('Error fetching highscores:', error);
        return [];
    }
}



const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const choicesDiv = document.getElementById("choices");
const resultsDiv = document.getElementById("results");
const playerChoiceDisplay = document.getElementById("player-choice");
const computerChoiceDisplay = document.getElementById("computer-choice");
const winnerDisplay = document.getElementById("winner");
const playerScoreDisplay = document.getElementById("player-score");
const highscoresList = document.getElementById("highscores-list");
const playerNameDisplay = document.getElementById("player-name-display");
getHighscores().then(displayHighscores);

playerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    playerName = playerNameInput.value;
    playerNameDisplay.innerText = `${playerName}`;
    const highscores = await getHighscores();
    displayHighscores(highscores);

});

document.getElementById("rock").addEventListener("click", () => playRound("rock"));
document.getElementById("paper").addEventListener("click", () => playRound("paper"));
document.getElementById("scissors").addEventListener("click", () => playRound("scissors"));

function playRound(playerChoice) {
    const choices = ["rock", "paper", "scissors"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    playerChoiceDisplay.innerText = playerChoice;
    computerChoiceDisplay.innerText = computerChoice;

    
    if (playerChoice === computerChoice) {
        winnerDisplay.innerText ='Tie'
        
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        playerScore++;
        winnerDisplay.innerText=playerNameInput.value;
    } else {
        winnerDisplay.innerText = 'Computer'
        
        
        if (playerName) {
            sendResultToBackend(playerName, playerScore);
        }
         playerScore = 0;
        playerScoreDisplay.innerText = playerScore;
    }

    winnerDisplay.innerTextt = winner;
    playerScoreDisplay.innerText = playerScore;
}


function sendResultToBackend(playerName, playerScore) {
    const newScore = { name: playerName, score: playerScore };

    fetch('http://localhost:3000/api/highscores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newScore)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            getHighscores().then(highscores => displayHighscores(highscores));
        })
        .catch(error => {
            console.error('Error adding score:', error);
        });
}

function displayHighscores(highscores) {
    highscoresList.innerHTML = '';
    highscores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${score.name}: ${score.score}`;
        highscoresList.appendChild(listItem);
    });
}
function resetGame() {
    winnerDisplay.innerText = '';
    playerScore = 0;
    playerName = "";
    playerNameInput.value = "";
    winnerDisplay.innerText = "";
    playerScoreDisplay.innerText = "0";
    playerChoiceDisplay.innerText = "";
    computerChoiceDisplay.innerText = "";
}