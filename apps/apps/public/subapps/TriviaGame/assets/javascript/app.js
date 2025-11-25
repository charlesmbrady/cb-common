$(document).ready(function () {
  //////////////////////////  Sounds ////////////////////////////////////
  //////////////////////////  Object/Variables   //////////////////////////////
  var questions = [
    {
      question: "What was Walmart's most bought item in Virginia for 2018?",
      choices: ['Crayola Crayons', 'Instant Pot', 'Paper Towels', 'Mason Jars'],
      answer: 'Crayola Crayons',
      imgsrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA2Q7pYQuXfJAlPpdsgl9K6BeejPr9TKJElfcY8-HIOFka8Bmr',
    },
    {
      question:
        "What was Walmart's most bought item in North Carolina for 2018?",
      choices: [
        'Nintendo Switch',
        'Instant Pot',
        'Ozark Trail 20 oz. tumbler',
        'Folgers Coffee',
      ],
      answer: 'Ozark Trail 20 oz. tumbler',
      imgsrc:
        'https://i5.walmartimages.com/asr/188b6b0e-92ff-404a-87d7-d9f38fd95629_1.812a3487b09e8746aa1e69b866bb6500.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
    },
    {
      question: 'What is the diameter of Earth?',
      choices: ['8,000 miles', '10,000 miles', '5,000 miles', '7,000 miles'],
      answer: '8,000 miles',
      imgsrc:
        'data:image/jpeg;base64,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',
    },
    {
      question: "What was Walmart's most bought item in Colorado for 2018?",
      choices: [
        'Ozark Trail 20 oz. tumbler',
        'Toilet bowl cleaner',
        'Google Chromecast',
        'Inflatable airbed mattress',
      ],
      answer: 'Inflatable airbed mattress',
      imgsrc:
        'https://i5.walmartimages.com/asr/9546e125-cc92-4d8f-85e7-3ff453879119_1.2f5ea1c2b5a534d34602ab2771e5cefc.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
    },
  ];

  var correct = 0;
  var incorrect = 0;
  var unanswered = 0;
  var questionCounter = 0;
  var q = questions[questionCounter];
  var answer = '';
  var answers = []; //store the answers here? and maybe use them later

  var time = 30;
  var questionInterval;

  //******** ****************************************************************/
  //initially set display of everything to none except for title and start btn
  initial();

  ////////////////////////    Event Listeners  ////////////////////////////
  $('#start-btn').on('click', start); //run the start function when start button clicked
  $('#choices').on('click', '.choice', chooseAnswer); //run the chooseAnswer function when a choice is clicked
  $('#reset').on('click', initial);

  //////////////////////////  Functions   ///////////////////////////////
  function initial() {
    questionCounter = 0;
    correct = 0;
    incorrect = 0;
    unanswered = 0;
    time = 30;
    answer = '';
    answers = [];
    $('.initial-hide').css('display', 'none');
    $('.hide').css('display', 'none');
    $('#start').css('display', 'block');
  }

  function setChoices() {
    q = questions[questionCounter];
    clearInterval(questionInterval);
    time = 30;

    $('.hide').css('display', 'block'); //first unhide everything that may have been hidden
    $('.feedback').css('display', 'none'); //make sure any feedback is hidden
    $('#choices').html(''); //blank out the #choices div first then set new choices

    $('#timer').text(time);
    questionInterval = setInterval(decrement, 1000);
    $('#question').css('display', 'block');
    $('#question').text(q.question);

    $('#choices').css('display', 'block');

    //dynamically create the answer choices in the #choices row
    for (var i = 0; i < q.choices.length; i++) {
      var choiceBox = $('<div>');
      choiceBox.addClass('row');
      $('#choices').append(choiceBox);

      var choice = $('<div>');
      choice.addClass('col-sm-12');
      choice.addClass('choice');
      choice.attr('data-choice', q.choices[i]);
      choice.text(q.choices[i]);
      choiceBox.append(choice);
    }
  }
  function start() {
    $('#start').css('display', 'none');
    $('#game').css('display', 'block');
    $('#game').children('display', 'block');
    $('#choices').css('display', 'block');
    setChoices();
  }

  function chooseAnswer() {
    clearInterval(questionInterval);
    answer = $(this).data('choice');
    if (time == 0) {
      answer = '';
    }
    answers.push(answer); //store this answer in answers array

    showFeedback(); //show either "correct" or "incorrect" feedback
  }

  function showFeedback() {
    questionCounter++;
    if (answer == '') {
      showTimeout();
    } else if (answer == q.answer) {
      showSuccess();
    } else {
      showWrong();
    }
  }

  function showSuccess() {
    $('#question').css('display', 'none'); //hide question and choices
    $('#choices').css('display', 'none');

    $('img').attr('src', q.imgsrc);
    correct++;
    //show success feedback
    $('#success').css('display', 'block');
    $('.answer').text(q.answer);
    answer = '';

    isLastQuestion();
  }

  function showWrong() {
    $('#question').css('display', 'none'); //hide question and choices
    $('#choices').css('display', 'none');

    $('img').attr('src', q.imgsrc);
    incorrect++;
    //show wrong feedback
    $('#wrong').css('display', 'block');
    $('.answer').text(q.answer);
    answer = '';

    isLastQuestion();
  }

  function showTimeout() {
    $('#question').css('display', 'none'); //hide question and choices
    $('#choices').css('display', 'none');

    $('img').attr('src', q.imgsrc);
    unanswered++;
    $('#timeout').css('display', 'block');
    $('.answer').text(q.answer);
    answer = '';

    isLastQuestion();
  }

  function showFinal() {
    $('#question').css('display', 'none'); //hide question and choices
    $('#choices').css('display', 'none');

    $('.hide').css('display', 'block'); //first unhide everything that may have been hidden
    $('.feedback').css('display', 'none'); //hide any feedback

    $('#game').css('display', 'none');

    $('#final').css('display', 'block');
    $('#correct').text(correct);
    $('#incorrect').text(incorrect);
    $('#unanswered').text(unanswered);
  }

  function isLastQuestion() {
    if (questionCounter == questions.length) {
      setTimeout(showFinal, 3000);
    } else {
      setTimeout(setChoices, 3000);
    }
  }

  function decrement() {
    time--;
    $('#timer').text(time);

    if (time == 0) {
      chooseAnswer();
    }
  }
}); //end document.ready
