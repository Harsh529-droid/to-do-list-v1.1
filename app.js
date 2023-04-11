//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/Todo');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food",'rigno'];

const schema = { item : String};
const newSchema = {
   name : String,
   arrOfObjects : [schema]
};

const Item = mongoose.model('Item', schema);
const Todo = mongoose.model('Todo', newSchema);

app.get("/", function(req, res) {

  const day = date.getDate();
 
  Item.find({}).then((x) =>{
      res.render("list", {listTitle: 'today', newListItems: x});
  });

});

app.get("/:newListName", function (req,res) {
      
    const ln = req.params.newListName ;
    
    Todo.findOne({name : ln}).then((foundList) => {
       if(!foundList){
         const newList = new Todo({
            name : ln
         }) 
         newList.save().then(() => {console.log('new list saved');});

         res.render("list", {listTitle : ln, newListItems : newList.arrOfObjects} )  
       }else{
          
           Todo.findOne({name : ln}).then((x) =>{
           res.render("list", {listTitle: x.name, newListItems: x.arrOfObjects});
           });
       }
     });
      
});

app.post("/", function(req, res){

    const temp = new Item({
    item : req.body.newItem
});

  temp.save().then( () => {console.log('saved'); res.redirect("/"); });

});

app.post("/delete", function(req, res){

   let id = (req.body.checkbox);
  
   Item.deleteOne({_id : id}).then( () => {
     console.log('item deleted!');
     res.redirect('/');
   }); 
  
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
