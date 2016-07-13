var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var linkSchema = new Schema({
  link: String,
  short_url: String
},{timestamps : {createdAt: 'created_at'}})
var Link = mongoose.model('link',linkSchema);
module.exports = Link;
