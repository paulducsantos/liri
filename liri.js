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
      writeToFile(tweet[i].text + "\n");
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
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    writeToFile("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song: " + data.tracks.items[0].name);
    writeToFile("Song: " + data.tracks.items[0].name);
    console.log("Link: " + data.tracks.items[0].preview_url);
    writeToFile("Link: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name + "\n");
    var data = "Artist: " + data.tracks.items[0].artists[0].name
    writeToFile("Album: " + data.tracks.items[0].album.name + "\n");
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
      console.log("Year: " + movieDetails.Year);
      console.log("IMDB Rating: " + movieDetails.imdbRating);
      console.log("Country: " + movieDetails.Country);
      console.log("Language: " + movieDetails.Language);
      console.log("Plot: " + movieDetails.Plot);
      console.log("Cast: " + movieDetails.Actors);
      console.log("Plot: " + movieDetails.Plot);
      console.log("Rotten Tomatoes Rating: " + movieDetails.tomatoRating);
      console.log("Tomato Meter: " + movieDetails.tomatoMeter);
      console.log("Rotten Tomatoes Link: " + movieDetails.tomatoURL + "\n");
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