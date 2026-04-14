const Post = require('../models/Post');

exports.create = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.session.user._id 
    });
    
    await post.save();
    res.redirect(`/post/${post._id}`); // Redirect to the newly created post
  } catch (err) {
    console.log(err);
    res.send("Error creating post. Make sure you are logged in.");
  }
};

exports.viewSingle = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.send("Post not found.");
    }
    res.render('single-post', { post: post });
  } catch (err) {
    console.log(err);
    res.send("Invalid Post ID");
  }
};

exports.viewEditScreen = async function(req, res) {
  try {
    // Safety Check 1: Is the user actually logged in?
    if (!req.session.user) {
      return res.send("You must be logged in to perform this action.");
    }

    let post = await Post.findOne({ _id: req.params.id }).populate('author');
    
    // Safety Check 2: Does the post actually exist?
    if (!post) {
      return res.send("404: We could not find this post in the database.");
    }

    // Safety Check 3: Handle different ways the author data might be formatted
    let authorName = post.author.username ? post.author.username : post.author;

    if (authorName == req.session.user.username) {
      res.render('edit-post', { post: post });
    } else {
      res.send("You do not have permission to edit this post.");
    }
  } catch (err) {
    // This will print the exact reason for the crash in your VS Code terminal!
    console.log("🚨 VIEW EDIT SCREEN ERROR:", err);
    res.send("An error occurred. Please check your VS Code terminal.");
  }
};

exports.edit = async function(req, res) {
  try {
    if (!req.session.user) return res.send("You must be logged in.");

    let post = await Post.findOne({ _id: req.params.id }).populate('author');
    if (!post) return res.send("Post not found.");
    
    let authorName = post.author.username ? post.author.username : post.author;

    if (authorName == req.session.user.username) {
      post.title = req.body.title;
      post.body = req.body.body;
      await post.save();
      res.redirect(`/profile/${req.session.user.username}`);
    } else {
      res.send("You do not have permission to edit this post.");
    }
  } catch (err) {
    console.log("🚨 EDIT SAVE ERROR:", err);
    res.send("Error updating post. Please check your VS Code terminal.");
  }
};

exports.delete = async function(req, res) {
  try {
    if (!req.session.user) return res.send("You must be logged in.");

    let post = await Post.findOne({ _id: req.params.id }).populate('author');
    if (!post) return res.send("Post not found.");
    
    let authorName = post.author.username ? post.author.username : post.author;

    if (authorName == req.session.user.username) {
      await Post.deleteOne({ _id: req.params.id });
      res.redirect(`/profile/${req.session.user.username}`);
    } else {
      res.send("You do not have permission to delete this post.");
    }
  } catch (err) {
    console.log("🚨 DELETE ERROR:", err);
    res.send("Error deleting post. Please check your VS Code terminal.");
  }
};