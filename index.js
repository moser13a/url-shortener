var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
app.set('view engine', "ejs");

app.get('/',function(req, res) {
  res.render('index');
});
app.get('/:date',function(req, res) {

});
app.listen(port,function() {
  console.log('On port', port);
})
