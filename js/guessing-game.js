class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }
    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }
    isLower() {
        if(this.playersGuess < this.winningNumber) {
            return true;
        }
        return false;
    }
    playersGuessSubmission(guess) {
        if(isNaN(guess) || guess < 1 || guess > 100) {
            $('#subtitle').text(('That is not a valid guess!'))
            throw 'Invalid Guess';
        }
        this.playersGuess = guess;
        return this.checkGuess();
    }
    checkGuess() {
        if (this.playersGuess === this.winningNumber) {
            $('#submit-guess-btn, #hint-btn').prop('disabled', true);
            $('#title').text('Click Reset to play again!');
            $('input').prop('disabled', true);
            $('#subtitle').text(`You win! The winning number was ${this.winningNumber}.`)
        } 
        else if (this.pastGuesses.includes(this.playersGuess)) {
            $('#subtitle').text('You already guessed that number.');
        } 
        else {
            this.pastGuesses.push(this.playersGuess);
            $(`#guess-list li:nth-child(${this.pastGuesses.length})`).text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#submit-guess-btn, #hint-btn').prop('disabled', true);
                $('#title').text('Click Reset to play again!');
                $('input').prop('disabled', true);
                $('#subtitle').text(`You lose. The winning number was ${this.winningNumber}.`);
            }
            else {
                let diff = this.difference()
                if(this.isLower()) {
                    $('#subtitle').text(`${this.playersGuess} was too low, guess higher!`)
                }
                else {
                    $('#subtitle').text(`${this.playersGuess} was too high, guess lower!`)
                }
                if(diff < 10) return 'You\'re red hot!';
                if(diff < 25) return 'You\'re lukewarm.';
                if(diff < 50) return 'You\'re a bit chilly.';
                else return 'You\'re ice cold!';
            }
        }
    }
    provideHint() {
        let hintArray = [
            this.winningNumber,
            generateWinningNumber(),
            generateWinningNumber()
        ]
        return shuffle(hintArray);
    }
}

function generateWinningNumber() {
    return Math.ceil(Math.random() * 100);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function newGame() {
    return new Game();
}

function makeAGuess(game) {
    let guess = $('#input').val();
    $('#input').val('');
    let output = game.playersGuessSubmission(parseInt(guess, 10))
    $('#title').text(output)
}

$(document).ready(function () {
    let game = newGame();
    $('#submit-guess-btn').click(function() {
        makeAGuess(game);
    })
    $('#input').keypress(function(event) {
        if (event.which == 13) {
            makeAGuess(game);
        }
    })
    $('#hint-btn').click(function () {
        let hints = game.provideHint();
        $('#subtitle').text(`The winning number is either ${hints[0]}, ${hints[1]}, or ${hints[2]}.`);
    });
    $('#reset-btn').click(function () {
        game = newGame();
        $('#title').text('Guessing Game');
        $('#subtitle').text('Guess a number between 1-100!')
        let text = '?';
        $(".guess").html(text);
        $('#hint-btn, #submit-guess-btn').prop("disabled", false);
        $('#input').prop("disabled", false);
    });
})
