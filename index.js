var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var Link = require('./models/links');
var mongoose = require('mongoose');
require('dotenv').config();
app.set('view engine', "ejs");

app.get('/',function(req, res) {
  console.log(req.headers.host, ' ', req.originalUrl);
  res.render('index');

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
      Link.findOne().select('link short_url -_id').sort('-created_at').exec(function(err, link) {
        console.log(link);
        res.json(link);

      });
    }
  });
}
app.get('/:urlId',function(req, res) {
  Link.findOne({short_url: req.headers.host+'/'+req.params.urlId},function(err, link) {
    if (link!=null) {
      if (err) {
        console.error(err);
      }else {
          res.redirect(link.link);

      }
    }else {
      res.end('You have provided non existing short url, try again');

    }

  });
});
app.get('/new/http?s?:/*',function(req, res) {
  console.log(req.path);
  console.log(extractURL(req.path));
  console.log(req.headers.host, ' ', req.originalUrl);
  var shorId = Math.ceil((Math.random() * 8000) + 1000);
  if (isURL(extractURL(req.path))) {
    var validLink = extractURL(req.path);
    var link = new Link({link: validLink,short_url:req.headers.host+'/'+shorId});
    saveLink(link,res);
  }else {
    res.json({'error':'Error, your link is invalid'})
  }



});
mongoose.connect(process.env.DB_URL);
app.listen(port,function() {
  console.log('On port', port);
})
