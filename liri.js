debugger;
var fs = require("fs");
var request = require('request');
var Twitter = require("twitter");
var spotify = require('spotify');
var keys = require("./keys.js");

var params = process.argv.slice(2);
getCommand(params);

fs.writeFile('data-logger.txt', "", (err) => {
  if (err) throw err;
  // console.log('It\'s saved!');
});

function getCommand (command) {
  switch (command[0]) {
    case "my-tweets":
      getTweets();
      break;

    case "spotify-this-song":
      spotifyIt(command);
      break;

    case "movie-this":
      movieGetter(command);
      break;

    case "do-what-it-says":
      doFile();
      break;

    default:
      console.log("You did something wrong"); 
  }
}


// will get the last 20 tweets of paulducsantos
function getTweets () {
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  client.get('statuses/user_timeline', {screen_name: 'paulducsantos'},  function(error, tweet, response){
    if(error) throw error;
    for (var i = 0; i < 20; i++) {
      console.log(tweet[i].text);
      writeToFile("\n" + tweet[i].text + "\n");
      console.log("Tweeted on: " + tweet[i].created_at + "\n");
      writeToFile("Tweeted on: " + tweet[i].created_at + "\n")
    }
    // console.log(tweet[0].id);  // Tweet body. 
    //console.log(response);  // Raw response object. 
  });
}

function spotifyIt (song) {
  var songTitle;
  if (song[1] === "") {
    songTitle = "what’s my age again";
  } else {
    songTitle = song[1];
    for (var i = 2; i < song.length; i++) {
      songTitle += " " + song[i];
    }
  }

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    data = data.tracks.items[0];
    console.log("Artist: " + data.artists[0].name);
    writeToFile("\n" + "Artist: " + data.artists[0].name + "\n");
    console.log("Song: " + data.name);
    writeToFile("Song: " + data.name + "\n");
    console.log("Link: " + data.preview_url);
    writeToFile("Link: " + data.preview_url + "\n");
    console.log("Album: " + data.album.name + "\n");
    var data = "Artist: " + data.artists[0].name;
    writeToFile("Album: " + data.album.name + "\n");
  });
}

function movieGetter (movie) {
  var movieTitle;
  if (movie === "") {
    movieTitle = "Mr.Nobody";
  } else {
    movieTitle = movie[1];
    for (var i = 2; i < movie.length; i++) {
      movieTitle += " " + movie[i];
    }
  }
  
  var url = "http://www.omdbapi.com/?t=" + movieTitle + "&tomatoes=true";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieDetails = JSON.parse(body);
      console.log("Title: " + movieDetails.Title);
      writeToFile("\n" + "Title: " + movieDetails.Title + "\n");
      console.log("Year: " + movieDetails.Year);
      writeToFile("Year: " + movieDetails.Year + "\n");
      console.log("IMDB Rating: " + movieDetails.imdbRating);
      writeToFile("IMDB Rating: " + movieDetails.imdbRating + "\n");
      console.log("Country: " + movieDetails.Country);
      writeToFile("Country: " + movieDetails.Country + "\n");
      console.log("Language: " + movieDetails.Language);
      writeToFile("Language: " + movieDetails.Language + "\n");
      console.log("Plot: " + movieDetails.Plot);
      writeToFile("Plot: " + movieDetails.Plot + "\n");
      console.log("Cast: " + movieDetails.Actors);
      writeToFile("Cast: " + movieDetails.Actors + "\n");
      console.log("Plot: " + movieDetails.Plot);
      writeToFile("Plot: " + movieDetails.Plo + "\n");
      console.log("Rotten Tomatoes Rating: " + movieDetails.tomatoRating);
      writeToFile("Rotten Tomatoes Rating: " + movieDetails.tomatoRating + "\n");
      console.log("Tomato Meter: " + movieDetails.tomatoMeter);
      writeToFile("Tomato Meter: " + movieDetails.tomatoMeter + "\n");
      console.log("Rotten Tomatoes Link: " + movieDetails.tomatoURL + "\n");
      writeToFile("Rotten Tomatoes Link: " + movieDetails.tomatoURL + "\n");
    }
  });
}

function doFile () {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    if (err) throw err;
    data = data.replace(/\n/g, ',').split(",");
    for (var i = 0; i < data.length; i += 2) {
      var sendData = [data[i], data[i+1]];
      getCommand(sendData);
    }
  });
}

function writeToFile (logThis) {
  fs.appendFile("data-logger.txt", logThis, (err) => {
    if (err) throw err;
    // console.log('The "data to append" was appended to file!');
  });
}