import { motion } from 'framer-motion';
import { useState } from 'react';

const SearchFilters = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
    rating: '',
    total_time: '',
    calories: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty values
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {});
    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      title: '',
      cuisine: '',
      rating: '',
      total_time: '',
      calories: ''
    });
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-200 flex items-center">
          <svg className="w-6 h-6 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Search Filters
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-orange-400 hover:text-orange-300"
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className={`${isExpanded ? 'block' : 'hidden'} md:block`}
        initial={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Title Filter */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleChange}
              placeholder="e.g., chocolate cake"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Cuisine Filter */}
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-300 mb-1">
              Cuisine
            </label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              value={filters.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-1">
              Rating
              <span className="text-xs text-gray-500 ml-1">(e.g., {'>='} 4.5)</span>
            </label>
            <input
              type="text"
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleChange}
              placeholder=">=4.5"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Total Time Filter */}
          <div>
            <label htmlFor="total_time" className="block text-sm font-medium text-gray-300 mb-1">
              Total Time (min)
              <span className="text-xs text-gray-500 ml-1">(e.g., {'<='} 60)</span>
            </label>
            <input
              type="text"
              id="total_time"
              name="total_time"
              value={filters.total_time}
              onChange={handleChange}
              placeholder="<=60"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Calories Filter */}
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-300 mb-1">
              Calories
              <span className="text-xs text-gray-500 ml-1">(e.g., {'<='} 400)</span>
            </label>
            <input
              type="text"
              id="calories"
              name="calories"
              value={filters.calories}
              onChange={handleChange}
              placeholder="<=400"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            Search Recipes
          </motion.button>
          {hasActiveFilters && (
            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Clear Filters
            </motion.button>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <strong>Tip:</strong> Use comparison operators like <code className="bg-gray-800 px-1 rounded text-orange-400">{'>=4.5'}</code>, 
            <code className="bg-gray-800 px-1 rounded mx-1 text-orange-400">{'<=60'}</code>, 
            <code className="bg-gray-800 px-1 rounded text-orange-400">{'==5'}</code> for numeric fields (rating, time, calories)
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default SearchFilters;
