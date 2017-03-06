// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Item = require('./models/item');

// Connect to the myinventory MongoDB
mongoose.connect('mongodb://localhost:27017/myinventory');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'Items running low, check inventory' }); 
});

// Create a new route with the prefix /items
var itemsRoute = router.route('/items');

// Create endpoint /api/items for POSTS
itemsRoute.post(function(req, res) {
  // Create a new instance of the Item model
  var item = new Item();

  // Set the item properties that came from the POST data
  item.name = req.body.name;
  item.type = req.body.type;
  item.quantity = req.body.quantity;

  // Save the item and check for errors
  item.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Item added to the inventory!', data: item });
  });
});

// Create endpoint /api/items for GET
itemsRoute.get(function(req, res) {
  // Use the Item model to find all item
  Item.find(function(err, items) {
    if (err)
      res.send(err);

    res.json(items);
  });
});

// Create a new route with the /items/:item_id prefix
var itemRoute = router.route('/items/:item_id');

// Create endpoint /api/items/:item_id for GET
itemRoute.get(function(req, res) {
  // Use the Item model to find a specific item
  Item.findById(req.params.item_id, function(err, item) {
    if (err)
      res.send(err);

    res.json(item);
  });
});

// Create endpoint /api/items/:item_id for PUT
itemRoute.put(function(req, res) {
  // Use the Item model to find a specific item
  Item.findById(req.params.item_id, function(err, item) {
    if (err)
      res.send(err);

    // Update the existing item quantity
    item.quantity = req.body.quantity;

    // Save the item and check for errors
    item.save(function(err) {
      if (err)
        res.send(err);

      res.json(item);
    });
  });
});

// Create endpoint /api/items/:item_id for DELETE
itemRoute.delete(function(req, res) {
  // Use the Item model to find a specific item and remove it
  Item.findByIdAndRemove(req.params.item_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Item removed from the inventory!' });
  });
});

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('inventory running on port ' + port);
