// Create web server

// Import modules
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Create new comment
router.post('/new', function(req, res) {
    var newComment = new Comment({
        text: req.body.text,

=======
Suggestion 2

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// Create app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments list
const commentsByPostId = {};

// Get list of comments by post id
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Create new comment
app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // Get comments list for post id
  const comments = commentsByPostId[req.params.id] || [];

  // Add comment to list
  comments.push({ id: commentId, content });

  // Update comments list for post id
  commentsByPostId[req.params.id] = comments;

  // Send response
  res.status(201).send(comments);
});

// Start server
app.listen(4001, () => {
  console.log('Listening on 4001');
});

=======
Suggestion 3

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Create a new Express application
const app = express();

// Using bodyParser middleware
app.use(bodyParser.json());

// Enable CORS for all HTTP methods
app.use(cors());

// Using morgan middleware
app.use(morgan('combined'));

// Listen on port 8081
app.listen(process.env.PORT || 8081);

// Create a default GET route
app.get('/', (req, res) => {
    res.send({
        message: 'Hello World!'
    });
});

=======
Suggestion 4

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Import routes
const commentsRoute = require('./routes/comments');

// Use modules
app.use(bodyParser.json());
app.use(cors());
app.use('/comments', commentsRoute);

// Connect to DB
const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB!')
);

// Start listening
app.listen(3000, () => console.log('Server started on port 3000'));

=======
Suggestion 5

// Require
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get specific comment
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        res.json(comment);
    } catch (err) {
        res.json({ message: err });
    }
});

// Post new comment
router.post('/', async (req, res) => {
    const comment = new Comment({
        userId: req.body.userId,
        postId: req.body.postId,
        content: req.body.content,
        date: req.body.date
    });

    try {
        const savedComment = await comment.save();
        res.json(savedComment);
    } catch (err) {
        res.json({ message: err });
    }
});

// Delete specific comment
router.delete('/:commentId', async (req, res) => {
    try {
        const removedComment = await Comment.remove({ _id: req.params.commentId });
        res.json(removedComment);
    } catch (err) {
        res.json({ message: err });
    }
});

// Update specific comment
router.patch('/:commentId', async (req, res) => {
    try {
        const updatedComment = await Comment.updateOne(
            { _id: req.params.commentId },
            { $set: { content: req.body.content } }
        );
        res.json(updatedComment);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;

=======
Suggestion 6

// Import modules
const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/commentsController.js');

// GET: /comments
router.get('/', commentsController.index);

// GET: /comments/new
router.get('/new', commentsController.new);

// GET: /comments/:id
router.get('/:id', commentsController.show);

// POST: /comments
router.post('/', commentsController.create);

// GET: /comments/:id/edit
router.get('/:id/edit', commentsController.edit);

// PUT: /comments/:id
router.put('/:id', commentsController.update);

// DELETE: /comments/:id
router.delete('/:id', commentsController.delete);

// Export router
module.exports = router;

=======
Suggestion 7

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// Create a new app
const app = express();
// Allow cross-origin resource sharing
app.use(cors());
// Parse body of incoming request
app.use(bodyParser.json());

// Create an object to store comments
const commentsByPostId = {};

// Create a route handler for GET request to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  // Return the comments array for the given post id
  res.send(commentsByPostId[req.params.id] || []);
});

// Create a route handler for POST request to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
  // Generate a random id for the comment
  const commentId = randomBytes(4).toString('hex');
  // Get the content from the request body
  const { content } = req.body;

  // Get the array of comments for the given post id
  const comments = commentsByPostId[req.params.id] || [];
  // Add the new comment to the array
  comments.push({ id: commentId, content, status: 'pending' });
  // Update the comments array for the given post id
  commentsByPostId[req.params.id] = comments;

  // Send the comment to the event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });

  // Respond with the comments array
  res.status(201).send(comments);
});

// Create a route handler for POST request to /events
app.post('/events', async (req, res) => {
  // Get the event type and data from the request body
  const { type, data } = req.body;

  // Check if the event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get the comments array for the given post id
    const comments = commentsByPostId[data.postId];
    // Get the comment with the given id from the comments array
    const comment = comments.find((comment) =>

=======
Suggestion 8

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import models
const Comment = require('../models/comment');

// Import middleware
const auth = require('../middleware/auth');

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Comment text is required').not().isEmpty()]],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return bad request
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create new comment
      const newComment = new Comment({
        text: req.body.text,
        user: req.user.id,
        post: req.body.post,
      });

      // Save comment to database
      const comment = await newComment.save();

      // Return comment
      res.json(comment);
    } catch (err) {
      // Log error to console
      console.error(err.message);

      // Return server error
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/comments
// @desc    Get all comments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find all comments
    const comments = await Comment.find();

    // Return comments
    res.json(comments);
  } catch (err) {
    // Log error to console
    console.error(err.message);

    // Return server error
    res.status(500).send('Server error');
  }
});

// @route   GET api/comments/:id
// @desc    Get comment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Find comment by ID
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      // Return not found
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Return comment
    res.json(comment);
  } catch (err) {
    // Check if error is a cast error
    if (err.kind === 'ObjectId') {

=======
Suggestion 9

// Import modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// Create comment
router.post('/new', ensureAuthenticated, (req, res) => {
    const { content, post_id } = req.body;
    const user_id = req.user._id;

    // Validation
    const errors = [];
    if (!content || !post_id) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (errors.length > 0) {
        res.send({ errors });
    } else {
        const newComment = new Comment({
            user_id,
            post_id,
            content,
        });
        newComment.save()
            .then(comment => {
                Post.findById(post_id)
                    .then(post => {
                        post.comments.push(comment._id);
                        post.save()
                            .then(() => {
                                User.findById(user_id)
                                    .then(user => {
                                        user.comments.push(comment._id);
                                        user.save()
                                            .then(() => {
                                                res.send({ comment });
                                            });
                                    });
                            });
                    });
            })
            .catch(err => console.log(err));
    }
});

// Delete comment
router.post('/delete', ensureAuthenticated, (req, res) => {
    const { comment_id, post_id } = req.body;
    const user_id = req.user._id;

    // Validation
    const errors = [];
    if (!comment_id || !post_id) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if (errors.length > 0) {
        res.send({ errors });
    } else {
        Comment.findById(comment_id)
            .then(comment => {
                if (comment.user_id.toString() === user_id.toString()) {
                    comment.remove()
                        .then(() => {
                            Post.findById(post_id)
                                .then(post => {
                                    post.comments.remove(comment_id);
                                    post.save()
                                        .then(() => {
                                            User.findById(user_id)
                                                .then(user => {
                                                    user.comments.remove(comment_id);
                                                    user.save()
                                                        .then(() => {
                                                            res.send({ msg: 'Comment deleted' });
                                                        });
                                                });
                                        });
                                });
                        });
                } else {
                    res.send({ msg: 'Unauthorized access' });

=======
Suggestion 10

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Create router
const router = express.Router();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Create server
app.listen(3000, () => {
    console.log('Server started (http://localhost:3000/) !');
});

// GET method route
router.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

// GET method route
router.get('/about', (req, res) => {
    res.send('<h1>About page</h1>');
});

// GET method route
router.get('/contact', (req, res) => {
    res.send('<h1>Contact page</h1>');
});

// GET method route
router.get('/test', (req, res) => {
    const response = {
        status: 200,
        data: [
            { 'id': 1, 'title': 'Test 1' },
            { 'id': 2, 'title': 'Test 2' },
            { 'id': 3, 'title': 'Test 3' },
        ]
    };
    res.json(response);
});

// POST method route
router.post('/test', (req, res) => {
    const title = req.body.title;
    const response = {
        status: 200,
        data: [
            { 'id': 1, 'title': title },
            { 'id': 2, 'title': 'Test 2' },
            { 'id': 3, 'title': 'Test 3' },
        ]
    };
    res.json(response);
});

// Use the router
app.use('/', router);
