$(document).ready(function () {
  //api key   1oCQca09d4CBXwjvRpGZes9TEFKFoC0j
  //example API request "https://api.giphy.com/v1/gifs/search?q=ryan+gosling&rating=g&api_key=YOUR_API_KEY&limit=5"

  var topics = ['hedgehog', 'elephant', 'platypus', 'dog', 'cat', 'kangaroo'];
  var currentTopic = '';
  var limit = 10;

  renderTopics();
  //put this inside an event listener callback function

  //event listener for topics to pull in Gifs
  $('#topics').on('click', '.topic', function () {
    //allow the "topic" to be clicked again to pull in more gifs
    if ($(this).hasClass('currentTopic')) {
      limit += 5;
    } else {
      limit = 10;
    }

    //blank out gifs div
    $('#gifs').text('');

    //unshade previous active topic and shade new active topic
    $('.currentTopic').removeClass('currentTopic');
    $(this).addClass('currentTopic');
    currentTopic = $(this).text();

    var topic = $(this).attr('data-topic');
    var queryURL =
      'https://api.giphy.com/v1/gifs/search?q=' +
      topic +
      '&rating=g&api_key=1oCQca09d4CBXwjvRpGZes9TEFKFoC0j&limit=' +
      limit;

    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      console.log(response);
      var results = response.data;
      results.forEach(function (gif, i) {
        var gifDiv = $('<div>').addClass('gifDiv');
        var rating = $('<p>')
          .addClass('rating')
          .text('Rating: ' + results[i].rating);
        var fav = $('<img>')
          .addClass('fav')
          .attr(
            'src',
            'https://www.freeiconspng.com/uploads/heart-icon-14.png'
          );
        var gif = $('<img>')
          .addClass('gif')
          .attr('src', results[i].images.fixed_height_still.url)
          .attr('data-animate', results[i].images.fixed_height.url)
          .attr('data-still', results[i].images.fixed_height_still.url)
          .attr('data-state', 'still');
        rating.append(fav);
        gifDiv.append(gif, rating);
        $('#gifs').append(gifDiv);
      });
    });
  }); //end topic click event

  //event listener for animating/stilling gifs
  $('.container').on('click', '.gif', function () {
    var state = $(this).attr('data-state');

    if (state == 'still') {
      var url = $(this).attr('data-animate');

      $(this).attr('src', url);
      $(this).attr('data-state', 'animate');
    } else {
      var url = $(this).attr('data-still');

      $(this).attr('src', url);
      $(this).attr('data-state', 'still');
    }
  });

  $('#new-animal').on('submit', function (event) {
    event.preventDefault();

    var newAnimal = $('#animal-input').val().trim();
    if (newAnimal == '') {
      return false;
    }
    topics.push(newAnimal);
    renderTopics();

    $('#animal-input').value('');
  });

  //event listener for favorite click
  $('#gifs').on('click', '.fav', function () {
    var favoriteGif = $(this).parent().parent();
    $('#favorites').append(favoriteGif);
    $(this).addClass('favorite');
  });

  $('#favorites').on('click', '.fav', function () {
    var unfavoriteGif = $(this).parent().parent();
    unfavoriteGif.remove();
  });

  /////////////////// FUNCTIONS   //////////////////////////////
  function renderTopics() {
    $('#topics').text('');
    topics.forEach(function (topic) {
      var btn = $("<button class='btn btn-primary topic'>")
        .text(topic)
        .attr('data-topic', topic);
      if (topic == currentTopic) {
        btn.addClass('currentTopic');
      }
      $('#topics').append(btn);
    });
  }
});
