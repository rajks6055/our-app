const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. Handle Registration
exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    req.session.user = { username: user.username, _id: user._id };
    
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.send("Registration failed. Username or email might already exist.");
  }
};

// 2. Handle Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      
      req.session.user = { username: user.username, _id: user._id };
      
      req.session.save(function() {
        console.log("✅ SUCCESS: Session saved for user:", req.session.user.username);
        res.redirect('/');
      });
    } else {
      res.send("Invalid username or password.");
    }
  } catch (err) {
    console.log(err);
    res.send("Error logging in.");
  }
};

// 3. Handle Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};