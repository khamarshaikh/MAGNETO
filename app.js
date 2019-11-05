const express 	  = require('express');
const path 	 	  = require('path');
const hbs 		  = require('hbs');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const web 		  = require('./routes/web');
const url         = require('url');
const fs          = require('fs');
var session 	  = require('express-session');
const flash		  = require('connect-flash');
const redis 	  = require('redis');
const redisClient = redis.createClient();
const redisStore  = require('connect-redis')(session);
const app 		  = express();

var Login         = require('./server/models/login').login;

app.use(session({
	secret: 'ThisIsHowYouUseRedisSessionStorage',
	name: '_redisPractice',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
	store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
  }));



app.use(flash());
hbs.registerPartials("./views/partials");

redisClient.on('error', (err) => {
	console.log('Redis error: ', err);
  });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/magneto');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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