const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const pageRoute = require('./routes/pageRoute');
const taskRoute = require('./routes/taskRoute');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');


const app = express();

//Connect DB
mongoose.connect('mongodb://127.0.0.1/kanbanboard-db').then(()=> {
    console.log('DB Connected Successfuly')
});

//Template Engine
app.set("view engine", "ejs");

//Global Variable

global.userIN = null;

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/kanbanboard-db' })
  }));
  app.use(flash());


//Routes
app.use('*', (req, res, next)=> {
    userIN = req.session.userID;
    next();
});
app.use((req, res, next) => {
    res.locals.error_message = req.flash('error');
    next();
});
app.use('/', pageRoute);
app.use('/tasks', taskRoute);
app.use('/users', userRoute);


const port = 3000;
app.listen(port, ()=> {
    console.log(`App started on port ${port}`)
});