var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
var Schema = mongoose.Schema;
var validUrl = require('valid-url');
var shortid = require('shortid');


var Acortado = mongoose.model('Shorter', new Schema({
    original_url: {type: String, required: true},
    short_url: {type: String, required: true}
    })
);

var crearShortUrl = function(url, done) {
  // done(null, {"error":"invalid URL"});
  
    if ( validUrl.isUri(url) ) {
      
      var urlShorter = new Acortado({original_url: url, short_url: shortid.generate()});
      
      Acortado.findOne({original_url: url}, function (err, doc) {
        if (err) {
          done(err);
        } else if (doc !== null) {
          done(null, urlShorter);
        } else {
         urlShorter.save( function(err, urlShorter) {
           err ? done(err) : done(null, urlShorter);
         });
        }
      });
      
    } else {
      done(null, {error: 'invalid URL'});
    }
}

var consultarShortUrl = function(codigo, done) {
  Acortado.findOne({short_url: codigo}, function(err, data) {
    err ? done(err) : done(null, data);
  });
}


module.exports.crearShortUrl = crearShortUrl;
module.exports.consultarShortUrl = consultarShortUrl;
