const express 	  = require('express');
const path 	 	  = require('path');
const hbs 		  = require('hbs');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const web 		  = require('./routes/web');
const url         = require('url');
const fs          = require('fs');

const app 		  = express();

var Login         = require('./server/models/login').login;

hbs.registerPartials("./views/partials");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/magneto');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
	extended: true
  }));

app.use(express.static("./public"));
app.use('/', web);




app.listen(1337, () => {
	console.log('serving on port 1337');
});