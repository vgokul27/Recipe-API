const Recipe = require('../models/Recipe');


const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get recipes sorted by rating in descending order
    const recipes = await Recipe.find()
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination info
    const total = await Recipe.countDocuments();

    res.json({
      success: true,
      count: recipes.length,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Search recipes with filters and pagination
const searchRecipes = async (req, res) => {
  try {
    const { calories, title, cuisine, total_time, rating, page = 1, limit = 15 } = req.query;
    
    let query = {};

    // Filter by cuisine (exact match)
    if (cuisine) {
      query.cuisine = { $regex: new RegExp(cuisine, 'i') };
    }

    // Filter by title (partial match)
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    // Filter by total_time (supports <=, >=, ==)
    if (total_time) {
      const timeQuery = parseComparisonQuery(total_time);
      if (timeQuery) {
        query.total_time = timeQuery;
      }
    }

    // Filter by rating (supports <=, >=, ==)
    if (rating) {
      const ratingQuery = parseComparisonQuery(rating);
      if (ratingQuery) {
        query.rating = ratingQuery;
      }
    }

    // Filter by calories (from nutrients object)
    if (calories) {
      const caloriesQuery = parseComparisonQuery(calories);
      if (caloriesQuery) {
        // Extract numeric value from calories string in nutrients.calories
        // We need to use aggregation for this
        const aggregationPipeline = [
          {
            $match: query
          },
          {
            $addFields: {
              caloriesValue: {
                $toDouble: {
                  $trim: {
                    input: {
                      $replaceAll: {
                        input: { $ifNull: ['$nutrients.calories', '0'] },
                        find: ' kcal',
                        replacement: ''
                      }
                    }
                  }
                }
              }
            }
          },
          {
            $match: {
              caloriesValue: caloriesQuery
            }
          },
          {
            $project: {
              caloriesValue: 0
            }
          }
        ];

        // Get total count for pagination
        const countResult = await Recipe.aggregate([
          ...aggregationPipeline,
          { $count: 'total' }
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Get paginated results
        const recipes = await Recipe.aggregate([
          ...aggregationPipeline,
          { $sort: { rating: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: parseInt(limit) }
        ]);

        return res.json({
          success: true,
          count: recipes.length,
          total: total,
          page: parseInt(page),
          totalPages: Math.ceil(total / limit),
          data: recipes
        });
      }
    }

    // Execute query with pagination
    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      count: recipes.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Helper function to parse comparison operators
const parseComparisonQuery = (value) => {
  if (!value) return null;

  // Check for comparison operators
  if (value.startsWith('>=')) {
    return { $gte: parseFloat(value.substring(2)) };
  } else if (value.startsWith('<=')) {
    return { $lte: parseFloat(value.substring(2)) };
  } else if (value.startsWith('>')) {
    return { $gt: parseFloat(value.substring(1)) };
  } else if (value.startsWith('<')) {
    return { $lt: parseFloat(value.substring(1)) };
  } else if (value.startsWith('==')) {
    return parseFloat(value.substring(2));
  } else {
    // If no operator, treat as exact match
    return parseFloat(value);
  }
};

module.exports = {
  getRecipes,
  searchRecipes
};
