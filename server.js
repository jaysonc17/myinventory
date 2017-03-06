// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var itemController = require('./controllers/item');

// Connect to the myinventory MongoDB
mongoose.connect('mongodb://localhost:27017/myinventory');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /items
router.route('/items')
  .post(itemController.postItems)
  .get(itemController.getItems);

// Create endpoint handlers for /items/:item_id
router.route('/items/:item_id')
  .get(itemController.getItem)
  .put(itemController.putItem)
  .delete(itemController.deleteItem);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);

