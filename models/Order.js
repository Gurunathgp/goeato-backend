const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // e.g., 'pending', 'delivered'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);