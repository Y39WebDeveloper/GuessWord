// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector(".title").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Y39`;

// Setting Game Options

let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words

let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Yasser", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints

document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput(){
    const inputsContaier = document.querySelector(".inputs");

    // Create Main Try Div
    for(let i = 1; i <= numberOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Type ${i}</span>`;

        if (i !== 1) tryDiv.classList.add("disabled-input");

        // Create Inputs
        for(let j = 1; j <= numberOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }

        inputsContaier.appendChild(tryDiv);
    }

    inputsContaier.children[0].children[1].focus();

    // Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-input input");
    inputsInDisabledDiv.forEach((input) => {input.disabled = true});

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert Inputs To Uppercase
        input.addEventListener("input", function(e){
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index+1];
            if(e.inputType != "deleteContentBackward"){
                if(nextInput) nextInput.focus();
            }
        });
        // Navigation Letter
        input.addEventListener("keydown", function(event){
            const currrentIndex = Array.from(inputs).indexOf(event.target);
            if(event.key === "ArrowRight"){
                const nextInput = currrentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }
            if(event.key === "ArrowLeft"){
                const prevInput = currrentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus();
            }
            if(event.key === "Backspace" && inputs[currrentIndex].value == ""){
                const prevInput = currrentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus();
            }
        });
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses(){
    let successGuess = true;
    for(let i = 1; i <= numberOfLetters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i-1];

        // Game Logic
        if(letter == actualLetter){
            inputField.classList.add("in-place");
        }else if(wordToGuess.includes(letter) && letter !== ""){
            inputField.classList.add("not-in-place");
            successGuess = false;
        }else{
            inputField.classList.add("wrong");
            successGuess = false;
        }
    }

    // Check If User Win or Lose
    if(successGuess){
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

        // Disabled all inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-input"));
        guessButton.disabled = true;
        getHintButton.disabled = true;
    }else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-input");
        const currentTryInput = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInput.forEach((input) => {input.disabled = true});

        currentTry++;

        const nextTryInput = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInput.forEach((input) => {input.disabled = false});
        
        let el = document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-input");
            el.children[1].focus();
        }else{
            guessButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if(numberOfHints == 0){
        getHintButton.disabled = true;
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toLocaleUpperCase();
        }
    }
}

window.onload = function(){
    generateInput();
}