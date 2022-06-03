const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();

 
dotenv.config({path:'./config.env'});   


// const User = require('./model/userSchema');
 const PORT  = process.env.PORT;

app.use(express.json());

 app.use(require('./router/auth'));


//Middleware

function middleware(req, res, next) {
    console.log(`Hello Middleware`);
    next;
}





app.get('/', (req, res) => {
    res.send(`Hello World appjs`);
});

app.get('/about', middleware, (req, res) => {
    res.send(`Hello World About`);
});

app.get('/contact', (req, res) => {
    res.send(`Hello World Contact`);
});

app.get('/signin', (req, res) => {
    res.send(`Hello World SignIn`);
});

app.get('/signUp', (req, res) => {
    res.send(`Hello World SignUp`);
});




mongoose.connect(process.env.DATABASE, {
   useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (error) => {
    if (error) return console.error(error)
    console.log("Database Connection successful")
    app.listen(PORT, () => {
        console.log(`Server Running on Port ${PORT}`)
    })
})


