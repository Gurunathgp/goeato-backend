const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching food items...');
    const foodItems = await FoodItem.find();
    console.log('Fetched food items:', foodItems);
    if (foodItems.length === 0) {
      console.log('No food items found in the collection');
    }
    res.json(foodItems);
  } catch (err) {
    console.error('Error fetching food items:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/', adminAuth, async (req, res) => {
  console.log('POST request received at /api/food-items');
  console.log('Request body:', req.body);

  const { name, price, img, category } = req.body;
  if (!name || !price || !img || !category) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ message: 'All fields (name, price, img, category) are required' });
  }

  const foodItem = new FoodItem({
    name,
    price,
    img,
    category,
  });

  try {
    console.log('Attempting to save food item:', foodItem);
    const newFoodItem = await foodItem.save();
    console.log('New food item added:', newFoodItem);
    res.status(201).json(newFoodItem);
  } catch (err) {
    console.error('Error adding food item:', err);
    res.status(400).json({ message: err.message });
  }
});


router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) throw new Error('Food item not found');
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deletedItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) throw new Error('Food item not found');
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;