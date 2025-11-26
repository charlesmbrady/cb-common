var randomLetter = generateRandomLetter();
var wins = 0;
var losses = 0;
var guesses = 10;
var letters = [];
var input;

document.addEventListener('keydown', keystroke);
function keystroke() {
  var input = event.key;
  var includes = letters.includes(input);

  if (includes == false) {
    if (input >= 'a' && input <= 'z') {
      /***add letters to those guessed */
      letters.push(input);
      document.getElementById('letters').innerHTML = letters;

      /****decrease # of guesses****/
      guesses = guesses - 1;
      document.getElementById('guesses').innerHTML = guesses;

      /****if the number is the right number, increase wins, reset guesses and letters array and generate new random number and start over****/
      if (input == randomLetter) {
        alert('Congrats you won!  The letter was ' + randomLetter);
        wins = wins + 1;
        document.getElementById('wins').innerHTML = wins;

        guesses = 10;
        document.getElementById('guesses').innerHTML = guesses;

        letters = [];
        document.getElementById('letters').innerHTML = letters;

        randomLetter = generateRandomLetter();
      }

      /****if guesses gets to zero, increase losses, reset guesses and letters array, and generate new random # ***/
      if (guesses == 0) {
        losses = losses + 1;
        document.getElementById('losses').innerHTML = losses;

        guesses = 10;
        document.getElementById('guesses').innerHTML = guesses;

        letters = [];
        document.getElementById('letters').innerHTML = letters;

        randomLetter = generateRandomLetter();
      }
    }
  }
}

function generateRandomLetter() {
  var randomLower = String.fromCharCode(
    Math.floor(Math.random() * (90 - 65) + 65)
  );
  return randomLower.toLowerCase();
}
