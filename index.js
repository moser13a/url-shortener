var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var db = require('./models/db');
var Link = require('./models/links');
var mongoose = require('mongoose');

app.set('view engine', "ejs");

app.get('/',function(req, res) {
  res.render('index');
  console.log(db.url);
});

function saveLink(link) {

}


function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}
function extractURL(url) {
  return url.split('/new/')[1];
}
function saveLink(link, res){
  link.save(function(err) {
    if (err) {
      console.error(err);
    }else {
      Link.findOne().select('link -_id').sort('-created_at').exec(function(err, link) {
        console.log(link);
        res.json(link);

      });
    }
  });
}

app.get('/new/http?s?:/*',function(req, res) {
  console.log(req.path);
  console.log(extractURL(req.path));

  if (isURL(extractURL(req.path))) {
    var validLink = extractURL(req.path);
    var link = new Link({link: validLink});
    saveLink(link,res);
  }else {
    res.json({'error':'Error, your link is invalid'})
  }



});
mongoose.connect(db.url);
app.listen(port,function() {
  console.log('On port', port);
})
