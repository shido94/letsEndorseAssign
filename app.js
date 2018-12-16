const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
const userApi = require('./server/routes/user');

const app = express();

const port = 3000;

// app.use(cookieParser());
//
// app.use(session({
//   secret : 'keyboard cat',
//   cookie : {maxAge : 1000* 60 * 60 * 24 * 7},
//   resave : false,
//   path    : '/',
//   saveUninitialized : true
// }));

// app.use(express.limit('50MB'));
app.use(bodyParser.json({limit: '50MB'}));
app.use(bodyParser.urlencoded({limit: '50MB', extended: false}));
// app.use(express.static(__dirname + '/dist/newApp'));

app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/user', userApi);


// Server connection API

const server = http.createServer(app);
mongoose.connect('mongodb://rupesh:rupesh94@ds135704.mlab.com:35704/endorse',{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  server.listen(port, () =>{
    console.log('Server running at port ', port);
  });
});


