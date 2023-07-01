//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB")

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema)

//////////////////////Requesting targeting all article///////////////////

app.route("/articles")

.get(function (req, res) {

  Article.findOne().then(function (foundArticles) {
    res.send(foundArticles);
  }).catch(err => {
    res.send(err);
  });

})

.post(function (req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save().then(function () {

    res.send("Successfully added new article");
  }).catch(err => {
    res.send(err);
  });

})

.delete(function (req, res) {

  Article.deleteMany({}).then(function () {

    res.send("successfully deleted all articles");

  }).catch(err => {

    res.send(err);

  });
});

//////////////////////Requesting targeting a specific target
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
    res.send(foundArticle)
  }).catch(err => {
    res.send("No article matching was found");
  });
})

.put(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    {overwrite: true},
    ).then(function(){
      res.send("Successfully updated article");
    });
})

.patch(function(req,res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
  ).then(function(){
    res.send("Successfully updated patch call");
  }).catch(err =>{
    res.send(err);
  });
})

.delete(function(req,res){
  Article.findOneAndDelete(
    {title: req.params.articleTitle},
  ).then(function(){
    res.send("Successfully deleted");
  }).catch(err => {
    res.send(err);
  }); 
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});