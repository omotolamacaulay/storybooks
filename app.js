const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const cookieParser =require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

//Load User Model 
require('./models/User')

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express()

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', 'handlebars');

// Load Keys
const keys = require('./config/keys');

// Map Global Promise
mongoose.Promise = global.Promise

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// Passport Config
require('./config/passport')(passport);


app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next) => {
 res.locals.user = req.user || null;
 next()
})

// Use routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app started on port ${port}`)
})