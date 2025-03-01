const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const { adminAuth } = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('menu');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');
    if (!restaurant) throw new Error('Restaurant not found');
    res.json(restaurant);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Add a new restaurant (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a food item to a restaurant's menu (admin only)
router.post('/:id/menu', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) throw new Error('Restaurant not found');

    const foodItem = new FoodItem({
      ...req.body,
      restaurantId: req.params.id,
    });
    const newFoodItem = await foodItem.save();

    restaurant.menu.push(newFoodItem._id);
    await restaurant.save();

    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a restaurant (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) throw new Error('Restaurant not found');
    // Optionally, delete associated food items
    await FoodItem.deleteMany({ restaurantId: req.params.id });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;