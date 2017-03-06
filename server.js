// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var itemController = require('./controllers/item');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');

// Connect to the myinventory MongoDB
mongoose.connect('mongodb://localhost:27017/myinventory');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /items
router.route('/items')
  .post(authController.isAuthenticated, itemController.postItems)
  .get(authController.isAuthenticated, itemController.getItems);

// Create endpoint handlers for /items/:item_id
router.route('/items/:item_id')
  .get(authController.isAuthenticated, itemController.getItem)
  .put(authController.isAuthenticated, itemController.putItem)
  .delete(authController.isAuthenticated, itemController.deleteItem);

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);

