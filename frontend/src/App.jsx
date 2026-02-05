import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RecipeTable from './components/RecipeTable';
import RecipeDrawer from './components/RecipeDrawer';
import SearchFilters from './components/SearchFilters';
import Pagination from './components/Pagination';
import { recipeAPI } from './services/api';
import './index.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalRecipes, setTotalRecipes] = useState(0);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Fetch recipes on mount and when page/limit changes
  useEffect(() => {
    if (!isSearching) {
      fetchRecipes();
    } else {
      // Re-search when page changes during search
      handleSearchWithPagination();
    }
  }, [currentPage, itemsPerPage]);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeAPI.getAllRecipes(currentPage, itemsPerPage);
      setRecipes(data.data);
      setTotalPages(data.totalPages);
      setTotalRecipes(data.total);
    } catch (err) {
      setError('Failed to fetch recipes. Please make sure the backend server is running.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    setIsSearching(true);
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to page 1 when new search
    try {
      const data = await recipeAPI.searchRecipes(filters, 1, itemsPerPage);
      setRecipes(data.data);
      setTotalRecipes(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Search failed. Please check your filters and try again.');
      console.error('Error searching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWithPagination = async () => {
    if (!isSearching || Object.keys(activeFilters).length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await recipeAPI.searchRecipes(activeFilters, currentPage, itemsPerPage);
      setRecipes(data.data);
      setTotalRecipes(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Search failed. Please check your filters and try again.');
      console.error('Error searching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearching(false);
    setActiveFilters({});
    setCurrentPage(1);
    fetchRecipes();
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-10 h-10 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
              </motion.div>
              <h1 className="text-3xl font-bold text-white">Recipe Finder</h1>
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
               
              </motion.div>
            </div>
            <p className="text-gray-400 text-sm">Discover delicious recipes from around the world</p>
            {!isSearching && totalRecipes > 0 && (
              <div className="mt-3 text-white">
                <p className="text-xs text-gray-400">Total Recipes</p>
                <p className="text-xl font-bold text-orange-400">{totalRecipes.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <SearchFilters onSearch={handleSearch} onReset={handleResetSearch} />

        {/* Active Filters Display */}
        {isSearching && Object.keys(activeFilters).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">Active Filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium"
                >
                  {key}: {value}
                </span>
              ))}
              <span className="text-sm text-gray-300">({totalRecipes} results)</span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start"
          >
            <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-300 font-semibold">Error</h3>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Recipe Table */}
        <RecipeTable
          recipes={recipes}
          onRecipeClick={handleRecipeClick}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && recipes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* No Data Fallback */}
        {!loading && recipes.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
          >
            <svg className="mx-auto h-20 w-20 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-6 text-2xl font-semibold text-gray-200">Nice to Have!</h3>
            <p className="mt-2 text-gray-400">
              {isSearching 
                ? "No recipes match your search criteria. Try adjusting your filters."
                : "No recipes found in the database. Please import recipe data first."}
            </p>
            {isSearching && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetSearch}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
              >
                Clear Filters & View All
              </motion.button>
            )}
          </motion.div>
        )}
      </main>

      {/* Recipe Detail Drawer */}
      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Built with React, Tailwind CSS & Framer Motion
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Recipe API Project © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
