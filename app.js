// REQUIRE MODULE
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");

// CONNECTION TO THE DATABASE
mongoose.connect("mongodb+srv://admin-dynamicmd:Test-123@cluster0.z2blv.mongodb.net/todolistDB", {useNewUrlParser:true});

// CREATE EXPRESS APP 
const app = express();

// SETTING DEFAULT ENGINE TO EJS LIBRARY
app.set('view engine', 'ejs');

// USING THE EXTENDED MODULE FROM APP
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// FIRST CREATING SCHEMA 
const ItemsSchema = {
    name:{
        type: String,
    }
} 

// CREATING MODEL 
const Item = mongoose.model("Item", ItemsSchema);

// CRATING NEW MODEL 
const i1 = new Item({
    name: "To buy"
})

const i2 = new Item({
    name: "To cook"
})

const i3 = new Item({
    name: "To eat"
})

const defaultItems = [i1, i2, i3];

const listSchema = mongoose.Schema({
    name: String,
    items : [ItemsSchema]
})

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {

    Item.find({}, (err, ItemsFound)=>{
        if(ItemsFound.length === 0){
            Item.insertMany(defaultItems, (err)=> {
                if(err){
                    console.log(err);
                }else{
                    console.log("Succefully Inserted");
                }
            })
            res.redirect("/");
        }else{
            res.render('index', {listTitle:"Today", list: ItemsFound});
        }
        
    })

    
})

app.post("/", (req, res) => {
    var newItem = req.body.addItem;
    var listName = req.body.list;
    const item = new Item({
        name:newItem
    })

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}, (err, foundList)=>{
            if(err){
                console.log(err)
            }
            foundList.items.push(item)
            foundList.save();
            res.redirect("/"+listName);
        })

    }

})


app.get("/:listType", (req, res)=>{
    
    const listType = _.capitalize(req.params.listType) ;
    List.findOne({name: listType}, function(err, found){
        if(!err){
            console.log("Error"+err+" ");
            if(!found){ 
                const list = new List({
                    name:listType,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + listType);
            }else{
                res.render("index", {listTitle: found.name, list: found.items})
            }
        }
    })
    



})

// Delete Items
app.post("/delete", (req, res)=>{
    var listType = req.body.listName;
    var checkedItem = req.body.checkbox;

    if(listType === "Today"){
        Item.findByIdAndRemove({_id:checkedItem}, (err)=>{
            if(err){
                console.log(err)
            }
            res.redirect("/");
        })
    }else{
        List.findOneAndUpdate({name:listType}, {$pull: {items:{_id: checkedItem}}}, function(err, foundItem){
            if(!err){
                res.redirect("/" + listType)
            }
        })
    }
})

// starting node server
app.listen("3000", () => {
    console.log("up and running at 3000");
})