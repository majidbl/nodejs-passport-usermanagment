var express = require('express');
var app = express();
const exphbs = require('express-handlebars');
const userroute = require('./route/user.js')
var bodyParser = require('body-parser')
var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
const Nuser = require('./model');

app.use(express.static('public'))
// force: true will drop the table if it already exists
/**Nuser.sync(//{force: true}
          ).then(function () {
  // Table created
  console.log("Table created successfully!!!!!!");
});**/
/**Nuser.create({
  firstName:"Majid zare",
  fathername:"Ali",
  email:"majidzarephysics@gmail.com",
  identitynumber:"5080075066",
  birthday:Date()
}).then(() => console.log("new user inserted"));
**/
const passport = require('passport');
require('./config/passport')(passport);
var sessionStore = new session.MemoryStore();
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));


// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/users', userroute);
//app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
    section: function(name, options) { 
      if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
      }
  }
}));

//View engine setting
app.set('view engine', 'hbs');

app.get('/', function(req, res){
  res.render('home');
});

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});