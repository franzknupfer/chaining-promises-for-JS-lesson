Note: This lesson is a further exploration. You will not be expected to chain promises together for Friday's code review.

More complex applications may have many async operations. Let's say our application relies on two async functions, one reliant on the result of the other. We can't just use `Promise.all()`, which will wrap together when they are both completed. That's because one promise can't be completed without the other being completed first. We are waiting on the results of an async function which in turn is waiting on the results of _another_ async function.

Here's an example: let's say we want to chain two API calls together. We need to get the results of the first API call and then pass those results into a _second_ API call. How can we do that?

For example, imagine that we have a very silly application that will get the humidity of your current location and then return a gif representing that humidity. Yes, it's silly, but it chains together two calls from the APIs we've worked with this week: the Open Weather API and the Giphy API.

Here's how we can chain these calls together. (Once again, user interface logic and business logic are in the same file.)

```
let weatherKey = [WEATHER-KEY-HERE];
let giphyKey = [GIPHY-KEY-HERE];

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
```

First, we create separate functions for our promises: `weatherCall()` and `giphyCall()`. Separating out our code in this way will clean up our code considerably and make our promises easier to work with.

Note that these functions each _return_ a promise. Remember, if we want to capture a result from a JavaScript function, we need to return something. Up to this point, we've mostly focused on returning the value of a variable. However, we can also return functions and promise objects as well!

Why can't we just do something like this?

```
function weatherCall() {
  let promise = new Promise([promise code goes here...])
  return promise;
}
```

The example above will return `undefined`. That's because the code is sync while the promise itself is async, which means the `promise` variable will be `undefined` when it's returned. For that reason, we need to return the entire promise instead.

Even if you aren't chaining API calls together, it's still a good practice to extract your code into separate functions. (It will also give you practice using the `return` keyword with promises.)

Now that we have separate functions for each API call, it's much easier to chain them together. Let's take a look:

```
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
```

Look how much cleaner this code is now that our promises have been separated out and we can simply call `weatherCall()` and `giphyCall()`. This code should look relatively familiar by now; we use `.then()` to chain our promises together. Because we are using `.then()` our code knows that it should wait for the returned promise object to be resolved.

However, there's an important gotcha in this code. We need yet _another_ return statement for this to work. Why do we need to `return giphyCall(humidity)` when `giphyCall()` itself returns a promise?

While it's true that `giphyCall()` returns a value (the promise object), `then()` is also a function. If we don't have a return statement here, `giphyCall()` will return a value but `then()` will not.

In other words, our `then()` function calls our `giphyCall()` function. Then our `giphyCall()` function _returns_ a promise object to our `then()` function. Our `then()` function can then _return_ that promise to yet another `then()` function, which will wait for the promise to be resolved before carrying on.

This may seem complicated at first, but we're really just reiterating an important concept from Intro to Programming: functions generally return something. (If a function doesn't have a `return` statement, it will return `undefined`.) In Intro to Programming, we mostly returned values (or more technically, **expressions**) from our functions; however, we can also return things like other functions (in the case of `giphyCall()`) and promise objects.

If this is still confusing, don't worry. You aren't expected to chain promises together in this Friday's code review. However, if you understand the basics of promises and want an additional challenge for your two-day project, you're encouraged to experiment with chaining promises in your own code.
