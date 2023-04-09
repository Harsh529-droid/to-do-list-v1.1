//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/List');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food",'rigno'];
var dbItems = [];

const schema = { item : String};

const Item = mongoose.model('Item', schema);

const getData = async() => {
  return await Item.find({});
}

getData().then( x => { 
 dbItems = x;
});



app.get("/", function(req, res) {

  const day = date.getDate();

  console.log(dbItems);

  res.render("list", {listTitle: 'today', newListItems: dbItems});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
