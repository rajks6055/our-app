require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const postController = require('./controllers/postController');
const userController = require('./controllers/userController');
const Post = require('./models/Post'); 
const User = require('./models/User');

const app = express();

// --- 1. SERVER & SOCKET SETUP ---
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// --- 2. SESSION CONFIGURATION ---
const store = new MongoDBStore({
  uri: process.env.CONNECTIONSTRING,
  collection: 'sessions'
});

const sessionOptions = session({
  secret: process.env.SESSIONSECRET,
  // store: store, // FIX: Uncommented this so you don't get logged out when the server restarts!
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

// --- 3. SHARE SESSIONS ---
app.use(sessionOptions); // Tell Express to use sessions

io.use(function(socket, next) {
  sessionOptions(socket.request, socket.request.res || {}, next); 
});

// --- 4. SOCKET EVENT LISTENERS ---
io.on('connection', function(socket) {
  // Only allow logged-in users to chat
  if (socket.request.session && socket.request.session.user) {
    let user = socket.request.session.user;
    socket.emit('welcome', { username: user.username, avatar: user.avatar });
    
    socket.on('chatMessageFromBrowser', function(data) {
      socket.broadcast.emit('chatMessageFromServer', {
        message: data.message, 
        username: user.username, 
        avatar: user.avatar
      });
    });
  }
});

// --- 5. EXPRESS BOILERPLATE ---
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(function(req, res, next) {
  // This makes the 'user' object available inside ALL your EJS templates!
  res.locals.user = req.session.user;
  next();
});
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// --- 6. ROUTES ---
app.get('/', async (req, res) => {
  console.log("🏠 Homepage loaded. Current session user is:", req.session.user);

  if (req.session.user) {
    try {
      let allPosts = await Post.find().populate('author', 'username avatar').sort({ createdDate: -1 }); 
      
      res.render('home-dashboard', { 
        username: req.session.user.username,
        posts: allPosts 
      });
    } catch (err) {
      console.log("Error fetching posts:", err);
      res.render('home-dashboard', { username: req.session.user.username, posts: [] });
    }
  } else {
    res.render('home-guest');
  }
});

app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);

app.get('/create-post', (req, res) => {
  res.render('create-post');
});

app.get('/profile/:username', async (req, res) => {
  try {
    let profileUser = await User.findOne({ username: req.params.username });
    
    if (!profileUser) {
      return res.send("404: User not found");
    }

    let posts = await Post.find({ author: profileUser._id }).sort({ createdDate: -1 });

    res.render('profile', { 
      profileUsername: profileUser.username,
      profileAvatar: profileUser.avatar,
      posts: posts,
      currentUser: req.session.user ? req.session.user.username : null
    });

  } catch (err) {
    console.log(err);
    res.send("An error occurred fetching the profile.");
  }
});

app.post('/create-post', postController.create);
app.get('/post/:id', postController.viewSingle);

// --- EDIT & DELETE ROUTES ---
// 1. Show the edit screen
app.get('/post/:id/edit', postController.viewEditScreen);
// 2. Handle the form submission for the edit
app.post('/post/:id/edit', postController.edit);
// 3. Handle the delete action
app.post('/post/:id/delete', postController.delete);


// --- 7. DATABASE CONNECTION & SERVER START ---
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log('Success! Connected to local MongoDB.');
    
    server.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed. Is your local MongoDB server running?');
    console.error(err);
  });