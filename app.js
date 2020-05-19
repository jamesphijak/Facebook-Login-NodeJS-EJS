const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = require('express')()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const CLIENT_ID = '#'
const CLIENT_SECRET = '#'
passport.serializeUser(function(user, done) {
  done(null, user);
})
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})
passport.use(new FacebookStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id','name','email','photos']
  },
  function(accessToken, refreshToken, profile, done) {
    //ส่วนนี้จะเอาข้อมูลที่ได้จาก facebook ไปทำอะไรต่อก็ได้
    console.log(accessToken)
    console.log(refreshToken)
    done(null, profile)
  }
))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }))
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }))
app.get('/profile', (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

app.get('/logout', (req, res) => {
  console.log(req.logout())
  res.redirect('/');
})

app.listen(3000, () => {
  console.log('server is running at localhost!')
})