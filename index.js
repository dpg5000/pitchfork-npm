var request = require('superagent')
  , q = require('q')
  , async = require('async')
  , origArgs = process.argv
  , Pitchfork = {
      Search: require('./search'),
      Review: require('./review')
    };

function parse_args(args){
  var artistFlagIdx = args.indexOf("-a")
  var albumTitleIdx = args.indexOf("-t")

  if ( artistFlagIdx != -1 ) {
    var artist = args[artistFlagIdx+1]
  }
  if ( albumTitleIdx != -1 ) {
    var album = args[albumTitleIdx+1]
  }
  return {
    artist: artist,
    album: album,
    json: args.indexOf("--json") != -1,
    verbose: args.indexOf("-v") != -1,
    version: args.indexOf("-V") != -1
  }
}

// variables;
var opts = parse_args(origArgs);
var artist = opts.artist || null;
var album = opts.album || null;
var json = opts.json || false;
var verbose = opts.verbose || false;
var version = opts.version || false;

// if there are args (i.e. running in commandline mode)

// if in "help mode"
if (origArgs.indexOf("-h") != -1 || origArgs.length == 4) {
  // display usage
  console.log("usage: pitchfork [-hVv] -a ARTIST_NAME -t ALBUM_TITLE")

// if there's an artist and/or album
} else if (version) {
  console.log(require("./package").version)
} else if (artist || album) {
   s = new Pitchfork.Search(artist, album);
    s.promise.then(function(){
      // console.log(JSON.stringify(s.results[0]));
      var rev = s.results[0];
      rev.promise.then(function(){
        if (json || verbose) {
          console.log(JSON.stringify(rev.attributes))
        } else {
          console.log(JSON.stringify(rev.truncated()));
        }
      })
    })
}

module.exports = Pitchfork;