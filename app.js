const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("my-sql");
const session = require('express-session')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
require('dotenv').config()
const app = express();

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.use(bodyParser.json());



const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
});




connection.connect((error) => {
    if (error) {
        console.error("Failed to connect to database:", error);
    } else {
        console.log("Connected to database.");
    }
});



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/signup.html",function(req,res){
    var un = req.body.username;
    var pass = req.body.password;
    var email = req.body.email;
    var name = req.body.name;

    console.log(name,email,un,pass);
    

    //Save the booking information in the database
    const sql =
        "INSERT INTO user(Uname,email,username,pass) VALUES (?,?,?,?)";
    const values = [
       name,
       email,
       un,
       pass
    ];

    connection.query(sql, values, (error, result) => {
        if (error) {
            console.error("Failed to save user:", error);
            //res.status(500).send("Failed to save booking.");
        } else {
            console.log("User saved:", result);
            res.redirect("/");
            //res.status(200).send("Booking added Succesfully!");
        }
    });
})



app.get("/login.html",function(req,res){
    
    res.sendFile(__dirname + "/login.html");
})
app.post("/login.html",function(req,res){
    let usn = req.body.username;
    let password = req.body.password;

    console.log(usn);
    console.log(password);

    const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
  connection.query(sql, [usn, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 1) {
      // Valid login
      console.log("Login Succesfull");
      res.redirect("/subscriptions.html");
    } else {
      // Invalid login
      res.send('Invalid username or password');
}
    });


})
app.listen(3000,function(){
    console.log("Server started on port 3000");
})

app.get("/subscriptions.html",function(req,res){
    console.log("admin");
    res.sendFile(__dirname + "/subscriptions.html");
})

app.get("/monthly/mob.html",function(req,res){
    console.log("admin");
    res.sendFile(__dirname + "/monthly/mob.html");
})