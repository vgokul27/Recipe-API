const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Recipe = require('../models/Recipe');
const connectDB = require('../config/db');

// Function to check if a value is NaN or "NaN" string
const isNaNValue = (value) => {
  return value === 'NaN' || 
         (typeof value === 'number' && isNaN(value)) || 
         value === null || 
         value === undefined;
};

// Function to sanitize numeric fields
const sanitizeNumericField = (value) => {
  if (isNaNValue(value)) {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Function to process recipe data and handle NaN values
const processRecipeData = (recipe) => {
  return {
    Contient: recipe.Contient || null,
    Country_State: recipe.Country_State || null,
    cuisine: recipe.cuisine || null,
    title: recipe.title || null,
    URL: recipe.URL || null,
    rating: sanitizeNumericField(recipe.rating),
    total_time: sanitizeNumericField(recipe.total_time),
    prep_time: sanitizeNumericField(recipe.prep_time),
    cook_time: sanitizeNumericField(recipe.cook_time),
    description: recipe.description || null,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
    nutrients: recipe.nutrients || null,
    serves: recipe.serves || null
  };
};

const importData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read JSON file
    const jsonPath = path.join(__dirname, '../../..', 'Downloads', 'US_recipes_null.json');
    console.log(`Reading JSON file from: ${jsonPath}`);
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const recipesData = JSON.parse(rawData);

    // Clear existing data
    console.log('Clearing existing recipes...');
    await Recipe.deleteMany({});

    // Process and insert recipes
    const recipes = Object.keys(recipesData).map(key => {
      const recipe = recipesData[key];
      return processRecipeData(recipe);
    });

    // Filter out recipes with null title (like the gallery entries)
    const validRecipes = recipes.filter(recipe => recipe.title !== null);

    console.log(`Importing ${validRecipes.length} recipes...`);
    
    // Insert in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < validRecipes.length; i += batchSize) {
      const batch = validRecipes.slice(i, i + batchSize);
      await Recipe.insertMany(batch);
      console.log(`Imported ${Math.min(i + batchSize, validRecipes.length)} / ${validRecipes.length} recipes`);
    }

    console.log('Data import completed successfully!');
    console.log(`Total recipes imported: ${validRecipes.length}`);
    
    // Display some statistics
    const totalRecipes = await Recipe.countDocuments();
    const recipesWithRating = await Recipe.countDocuments({ rating: { $ne: null } });
    const recipesWithNullRating = await Recipe.countDocuments({ rating: null });
    
    console.log('\nStatistics:');
    console.log(`Total recipes in database: ${totalRecipes}`);
    console.log(`Recipes with rating: ${recipesWithRating}`);
    console.log(`Recipes with null rating (NaN handled): ${recipesWithNullRating}`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
