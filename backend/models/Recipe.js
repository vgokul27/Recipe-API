const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  cuisine: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    default: null
  },
  prep_time: {
    type: Number,
    default: null
  },
  cook_time: {
    type: Number,
    default: null
  },
  total_time: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  nutrients: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  serves: {
    type: String,
    default: null
  },
  // Additional fields from the JSON
  Contient: String,
  Country_State: String,
  URL: String,
  ingredients: [String],
  instructions: [String]
}, {
  timestamps: true
});

// Add indexes for search performance
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ title: 'text' });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ total_time: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
