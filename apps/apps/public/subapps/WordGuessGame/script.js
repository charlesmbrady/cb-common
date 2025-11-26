$(document).ready(function () {
  /*********************************sounds*******************************/
  var winSound = new Audio('./assets/sounds/success.mp3'); //add srcs for audio
  var loseSound = new Audio('./assets/sounds/lose.mp3');
  var guessSound = new Audio('./assets/sounds/guess.mp3');

  var backgroundMusic = new Audio('./assets/sounds/try2.mp3');
  backgroundMusic.loop = true;
  //backgroundMusic.play();                               //add background music to work
  ///////////////////////////////////////////////////////////////////////

  /*******Variables*******/
  var win = 0;
  var loss = 0;
  var total = win + loss;
  var gameOver = false;

  var words = [
    'alladin',
    'peter pan',
    'frozen',
    'lilo and stitch',
    'the lion king',
    'bambi',
    'cinderella',
    'the little mermaid',
    'robin hood',
    'pocahontas',
    'moana',
    'beauty and the beast',
    'mulan',
    'nightmare before christmas',
    'snow white',
    'the jungle book',
    'sleeping beauty',
    'alice in wonderland',
    'pinocchio',
    'dumbo',
  ]; //must be lowercase
  var counter = 0;

  //////////////////////////
  /********Game Object*******/
  var game = {
    guesses: 10,
    word: words[counter],
    display: [],
    letters: [],
  };
  //////////////////////////

  /*****************************************************************************************/
  $(document).on('keydown', guess); //Event listener

  newGame();

  /////////////////////////////////////////
  function guess() {
    backgroundMusic.play();
    var input = event.key;
    //input = input.toLowerCase();    //accept capital letters - wasn't working was still accepting capslock and tab etc.

    /******************* exceptions  *************************************************/
    //check to make sure lowercase input is letter.  If not, return 0
    if (input < 'a' || input > 'z') {
      alert('Guess a lowercase letter');
      return 0;
    }

    //check to make sure input hasn't been guessed before.  If so, return 0
    if (game.letters.includes(input)) {
      alert('Already guessed that letter');
      return 0;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////

    guessSound.play();
    //if those pass, loop through word checking if that letter is there, if not, decrease guesses.  Update display
    if (game.word.includes(input)) {
      for (var i = 0; i < game.word.length; i++) {
        if (input == game.word[i]) {
          game.display[i] = game.word[i];
        }
      }
    } else {
      game.guesses--;
    }
    game.letters.push(input);
    updateGame();
    checkGame();
    /*********************************************************************************/
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function checkGame() {
    if (game.display.includes('_')) {
      if (game.guesses > 0) {
        return 0;
      } else {
        loss++;
        loseSound.play();
        alert("You didn't get that one, it was " + game.word);
        newGame();
      }
    } else {
      win++;
      winSound.play();
      alert('You got that one! It was ' + game.word);
      newGame();
    }
  }

  function updateGame() {
    $('#display').html(game.display.join(' '));
    $('#letters').html(game.letters.join(' ').toUpperCase());
    $('#guesses').html(game.guesses);
    $('#wins').html(win);
    $('#losses').html(loss);
  }

  function newGame() {
    counter++;
    total = win + loss;
    game.word = words[counter];
    game.display = [];
    /*************** Make initial display array ******************/
    for (var i = 0; i < game.word.length; i++) {
      if (game.word[i] == ' ') {
        game.display.push('&nbsp;');
      } else {
        game.display.push('_');
      }
    }
    ////////////////////////////////////////////////////////////////
    $('#display').html(game.display.join(' ')); //write display array to html as string

    $('#wins').text(win); //write wins to html
    $('#losses').text(loss); //write losses to html

    game.guesses = 10; //reset guesses
    $('#guesses').text(game.guesses); //write guesses to html

    game.letters = []; //reset letters
    $('#letters').text(game.letters); //write letters to html

    if (total == words.length) {
      alert('game is over');
      gameOver = true;
    }
  }
}); //end javascript
