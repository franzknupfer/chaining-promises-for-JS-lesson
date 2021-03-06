let weatherKey = "64ce943b2cb480de60202f7a5a15b25c";
let giphyKey = "8ef085759e344f9c9cf34b6ab2af0e86";

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    let city = $('#location').val();
    $('#location').val("");

    function weatherCall() {
      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`;

        request.onload = function() {
          if (this.status === 200) {
            resolve(request.response);
          } else {
            reject(Error(request.statusText));
          }
        }

        request.open("GET", url, true);
        request.send();
      });
    }

    function giphyCall(humidity) {
      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let url = `http://api.giphy.com/v1/gifs/search?q=${humidity}&api_key=${giphyKey}&limit=5`

        request.onload = function() {
          if (this.status === 200) {
            resolve(request.response);
          } else {
            reject(Error(request.statusText));
          }
        }

        request.open("GET", url, true);
        request.send();
      });
    }

    weatherCall()
      .then(function(response) {
        let body = JSON.parse(response);
        let humidity = body.main.humidity;
        return giphyCall(humidity);
      })
      .then(function(response) {
      let giphyResponse = JSON.parse(response);
      let image = giphyResponse["data"][0]["images"]["downsized"]["url"];
      $('.showImage').html(`<img src='${image}'>`);
    });
  });
});
