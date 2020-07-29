const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname))

let con = mysql.createConnection({
    // database: "web",
    host: "localhost",
    user: "root",
    password: "@mysql"
})

con.connect(function(err) {
    if(err) throw err;
    console.log("connected to mysql")
})


// //create database
// let sql = "create database web"
// con.query(sql, function(err, result) {
//     if (err) throw err;
//     console.log("database created")
// })

//use database
sql = "use web"
con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("database changed")
})

// //create table
// sql = "create table items(id int primary key auto_increment, link text, name text, description text)"
// con.query(sql, function(err, result) {
//     if (err) throw err;
//     console.log("table created")
// })

app.get("/", function(req, res) { 
    sql = "select * from items"
    con.query(sql, function(err, result) {
    if (err) throw err;
    res.render("index.ejs", {result})    
    })
})
   
app.get("/add", function(req, res) {    
    res.render("add.ejs")
})

app.post("/new", function(req, res) {
    sql = `insert into items (link, name, description) values ('${req.body.link}', '${req.body.name}', '${req.body.desc}')`
    con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("item inserted")    
    })  
})

app.get("/items/:id", function(req, res) {    
    let id = req.params["id"]      
    sql = `select * from items where id=${id}`
    con.query(sql, function(err, result) {
        if (err) throw err;
        res.render("details.ejs", {result})
    }) 
})

app.post("/items/update", function(req, res) {    
    let id = req.body.id
    sql = `update items set link='${req.body.link}', name='${req.body.name}', description='${req.body.desc}' where id=${id}`
    con.query(sql, function(err, result) {
        if (err) throw err;        
        console.log("item updated")
    })
})

app.post("/items/delete", function(req, res) {
    let id = req.body.id
    sql = `delete from items where id=${id}`
    con.query(sql, function(err, result) {
        if (err) throw err;        
        console.log("item deleted")
    })
})

app.listen(4000, function() {
    console.log("Server listen on port 4000")
})