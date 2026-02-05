import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const recipeAPI = {
  // Get all recipes with pagination
  getAllRecipes: async (page = 1, limit = 15) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Search recipes with filters and pagination
  searchRecipes: async (filters, page = 1, limit = 15) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params: { ...filters, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }
};
