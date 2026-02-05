import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const RecipeDrawer = ({ recipe, isOpen, onClose }) => {
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);

  if (!recipe) return null;

  const parseNutrients = () => {
    if (!recipe.nutrients) return null;

    return {
      calories: recipe.nutrients.calories || 'N/A',
      carbohydrateContent: recipe.nutrients.carbohydrateContent || 'N/A',
      cholesterolContent: recipe.nutrients.cholesterolContent || 'N/A',
      fiberContent: recipe.nutrients.fiberContent || 'N/A',
      proteinContent: recipe.nutrients.proteinContent || 'N/A',
      saturatedFatContent: recipe.nutrients.saturatedFatContent || 'N/A',
      sodiumContent: recipe.nutrients.sodiumContent || 'N/A',
      sugarContent: recipe.nutrients.sugarContent || 'N/A',
      fatContent: recipe.nutrients.fatContent || 'N/A',
    };
  };

  const nutrients = parseNutrients();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-800"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-lg z-10 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{recipe.title || 'Untitled Recipe'}</h2>
                  <p className="text-gray-400 text-sm">{recipe.cuisine || 'Unknown Cuisine'}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-gray-700 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              {recipe.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{recipe.description}</p>
                </motion.div>
              )}

              {/* Total Time with Expandable Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Total Time</h3>
                    <p className="text-gray-200 text-lg font-medium">
                      {recipe.total_time ? `${recipe.total_time} minutes` : 'N/A'}
                    </p>
                  </div>
                  {(recipe.cook_time || recipe.prep_time) && (
                    <button
                      onClick={() => setIsTimeExpanded(!isTimeExpanded)}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform ${isTimeExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isTimeExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-700 space-y-2"
                    >
                      {recipe.prep_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Prep Time:</span>
                          <span className="font-medium text-gray-200">{recipe.prep_time} min</span>
                        </div>
                      )}
                      {recipe.cook_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cook Time:</span>
                          <span className="font-medium text-gray-200">{recipe.cook_time} min</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Serves */}
              {recipe.serves && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Serves</h3>
                  <p className="text-gray-200 text-lg font-medium">{recipe.serves}</p>
                </motion.div>
              )}

              {/* Nutrition Information */}
              {nutrients && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg p-5 border border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nutrition Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Calories</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.calories}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Carbohydrates</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.carbohydrateContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Cholesterol</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.cholesterolContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Fiber</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.fiberContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Protein</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.proteinContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Saturated Fat</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.saturatedFatContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Sodium</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.sodiumContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Sugar</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.sugarContent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm col-span-2 border border-gray-700">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Total Fat</p>
                      <p className="text-gray-200 font-bold text-lg">{nutrients.fatContent}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-200 mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span className="text-gray-300">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Instructions */}
              {recipe.instructions && recipe.instructions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-200 mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-300 flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeDrawer;
