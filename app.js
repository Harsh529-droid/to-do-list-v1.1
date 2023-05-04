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
   arrOfObjects : []
}

const Item = mongoose.model('Item', schema);
const Todo = mongoose.model('Todo', newSchema);

const fn = (str) => {
    let arr = [];
    let s1 = "", s2 = "";
    var i;
    
    for(i=0;i<str.length;i++){
       if(str[i]=='/')break;
       if(str[i] !== '/')s1 = s1 + str[i];
    }
    for(i=i+1;i<str.length;i++){
      s2 += str[i];
    }
    arr.push(s1); arr.push(s2);
    return arr;

}
/******************************************************************************* */

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
            name : ln,
            arrOfObjects : []
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
    
  const ln = req.body.list ;

  const temp = new Item({
  item : req.body.newItem
  });
  
  if(ln === 'today'){
     temp.save().then(() => {
       res.redirect("/");
     });
  }else{
     
     Todo.findOne({name : ln}).then((x) => {
        
        x.arrOfObjects.push(temp);
        x.save().then(() => {
          res.redirect("/"+ln);
        });
      });
    }
 
});

app.post("/delete", function(req, res){

   let id = (req.body.checkbox);
   let arr = fn(id);
  
  if(arr[1] == "today"){
       Item.deleteOne({_id : arr[0]}).then( () => {
         console.log('item deleted!');
         res.redirect('/');
       });
   }else{
      
      Todo.findOne({name : arr[1]}).then((curr) =>{
          let x = arr[0]; //id of that list item
         
             const ft = curr.arrOfObjects.filter((currElem) => {
             return (currElem._id.toString() !== x ) ;
          });
          console.log(ft);

          Todo.updateOne({name : arr[1]},{arrOfObjects : ft}).then((it) =>{
            console.log(it.arrOfObjects);
            res.redirect('/'+arr[1]);
          });
      });
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
