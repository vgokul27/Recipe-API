# Recipe API - Technical Interview Preparation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Decisions](#architecture--design-decisions)
3. [Key Functions Explained](#key-functions-explained)
4. [Important Concepts](#important-concepts)
5. [Common Interview Questions & Answers](#common-interview-questions--answers)
6. [Code Walkthrough](#code-walkthrough)
7. [Technical Terms to Know](#technical-terms-to-know)

---

## 1. Project Overview

**What did you build?**
A RESTful API for managing and searching recipe data, with features like:
- Pagination and sorting
- Advanced search with multiple filters
- NaN value handling for data integrity
- MongoDB Atlas cloud database integration

**Tech Stack:**
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Data Source:** JSON file with 1000+ recipes

---

## 2. Architecture & Design Decisions

### MVC Pattern (Model-View-Controller)
```
backend/
├── models/          → Database Schema (Model)
├── controllers/     → Business Logic (Controller)
├── routes/          → API Endpoints (Routes)
└── server.js        → Entry Point
```

**Why this structure?**
- **Separation of Concerns:** Each component has a single responsibility
- **Maintainability:** Easy to update one part without affecting others
- **Scalability:** Can add new features without restructuring

### REST API Design
- **GET /api/recipes** - Retrieve all recipes (paginated)
- **GET /api/recipes/search** - Search with filters

**Why RESTful?**
- Industry standard
- Stateless communication
- Easy to understand and use
- Works well with HTTP methods

---

## 3. Key Functions Explained

### 3.1 Database Connection (`config/db.js`)

```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
```

**What it does:**
- Connects to MongoDB Atlas using Mongoose
- Uses async/await for handling promises
- Exits process if connection fails

**Key Concepts:**
- `async/await` - Modern JavaScript for handling asynchronous operations
- `process.env` - Accesses environment variables
- `process.exit(1)` - Terminates app with error code

**Interview Question:** "Why use environment variables?"
**Answer:** Security! Never hardcode credentials in source code. Environment variables keep sensitive data separate and allow different configs for dev/production.

---

### 3.2 Recipe Schema (`models/Recipe.js`)

```javascript
const recipeSchema = new mongoose.Schema({
  cuisine: { type: String, required: false },
  title: { type: String, required: false },
  rating: { type: Number, default: null },
  prep_time: { type: Number, default: null },
  // ... other fields
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ title: 'text' });
recipeSchema.index({ rating: -1 });
```

**What it does:**
- Defines the structure of recipe documents in MongoDB
- Sets data types and validation rules
- Creates indexes for faster queries

**Key Concepts:**
- **Schema:** Blueprint for document structure
- **Indexes:** Speed up database queries (like a book index)
- **Text Index:** Enables full-text search on title field
- **-1 means descending order** (highest ratings first)

**Interview Question:** "Why use indexes?"
**Answer:** Indexes dramatically improve query performance. Without indexes, MongoDB scans every document. With indexes, it quickly finds relevant documents. Think of it like a book's index vs reading every page.

---

### 3.3 NaN Handling in Import Script (`scripts/importData.js`)

```javascript
const isNaNValue = (value) => {
  return value === 'NaN' || 
         (typeof value === 'number' && isNaN(value)) || 
         value === null || 
         value === undefined;
};

const sanitizeNumericField = (value) => {
  if (isNaNValue(value)) {
    return null;  // Convert NaN to NULL
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
};
```

**What it does:**
- Checks if a value is NaN (Not a Number)
- Converts NaN values to NULL before database storage
- Ensures data integrity

**Why this matters:**
- NaN values cause issues in databases
- NULL is a proper way to represent missing numeric data
- Prevents errors in calculations and comparisons

**Interview Question:** "What's the difference between null and undefined?"
**Answer:** 
- `null` = intentional absence of value (you set it)
- `undefined` = variable declared but not assigned
- `NaN` = "Not a Number" - result of invalid numeric operation

---

### 3.4 Get All Recipes Controller (`controllers/recipeController.js`)

```javascript
const getRecipes = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query database with pagination
    const recipes = await Recipe.find()
      .sort({ rating: -1 })  // Sort by rating descending
      .skip(skip)             // Skip previous pages
      .limit(limit)           // Limit results per page
      .lean();                // Return plain JS objects (faster)

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
```

**What it does:**
- Retrieves recipes from database with pagination
- Sorts by rating (highest first)
- Returns metadata (total count, pages, etc.)

**Key Concepts:**
- **Pagination:** Loading data in chunks instead of all at once
  - Improves performance
  - Better user experience
  - Reduces memory usage

- **skip & limit:** 
  - If page=2, limit=10 → skip first 10, show next 10
  - Formula: `skip = (page - 1) * limit`

- **.lean():** Returns plain JavaScript objects instead of Mongoose documents
  - Faster performance
  - Less memory usage
  - Use when you don't need Mongoose features

**Interview Question:** "Why use pagination?"
**Answer:** With 1000+ recipes, loading all at once would:
- Slow down the API
- Use too much memory
- Take long to load on frontend
Pagination loads small chunks, improving performance and UX.

---

### 3.5 Search Function with Filters

```javascript
const searchRecipes = async (req, res) => {
  try {
    const { calories, title, cuisine, total_time, rating } = req.query;
    let query = {};

    // Filter by cuisine (case-insensitive)
    if (cuisine) {
      query.cuisine = { $regex: new RegExp(cuisine, 'i') };
    }

    // Filter by title (partial match)
    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    // Filter by total_time with comparison operators
    if (total_time) {
      const timeQuery = parseComparisonQuery(total_time);
      if (timeQuery) {
        query.total_time = timeQuery;
      }
    }

    // Execute query
    const recipes = await Recipe.find(query).lean();

    res.json({
      success: true,
      count: recipes.length,
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
```

**What it does:**
- Builds dynamic MongoDB query based on filters
- Supports partial text matching
- Handles comparison operators (>=, <=, etc.)

**Key Concepts:**

1. **Regular Expressions ($regex):**
   ```javascript
   { title: { $regex: /pie/i } }
   ```
   - Finds titles containing "pie"
   - 'i' flag = case-insensitive
   - Matches "Apple Pie", "PIE", "Shepherd's pie"

2. **Dynamic Query Building:**
   ```javascript
   let query = {};
   if (title) query.title = ...;
   if (cuisine) query.cuisine = ...;
   ```
   - Only adds filters that are provided
   - Flexible - works with any combination

---

### 3.6 Comparison Query Parser

```javascript
const parseComparisonQuery = (value) => {
  if (!value) return null;

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
    return parseFloat(value);
  }
};
```

**What it does:**
- Parses comparison operators from query strings
- Converts to MongoDB query operators

**Example:**
```
Input:  ">=4.5"
Output: { $gte: 4.5 }

MongoDB query: { rating: { $gte: 4.5 } }
Meaning: Find recipes where rating >= 4.5
```

**MongoDB Operators:**
- `$gte` - Greater than or equal
- `$lte` - Less than or equal
- `$gt` - Greater than
- `$lt` - Less than

**Interview Question:** "Why parse the operator from the string?"
**Answer:** HTTP query parameters are strings. We need to extract the operator (>=) and value (4.5) separately, then convert to MongoDB's query format. This allows users to write intuitive URLs like `?rating=>=4.5`.

---

### 3.7 Calories Filter with Aggregation

```javascript
if (calories) {
  const caloriesQuery = parseComparisonQuery(calories);
  if (caloriesQuery) {
    const recipes = await Recipe.aggregate([
      { $match: query },  // Apply other filters first
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
      }
    ]);
  }
}
```

**What it does:**
- Extracts numeric value from "450 kcal" string
- Removes " kcal" text
- Converts to number for comparison

**Why use Aggregation Pipeline?**
Calories is stored as "450 kcal" (string), not a number. We need to:
1. Remove " kcal"
2. Convert to number
3. Then compare

Regular queries can't do this - need aggregation!

**Pipeline Stages:**
1. `$match` - Filter documents
2. `$addFields` - Add computed fields
3. `$match` - Filter by computed field

**Interview Question:** "What's the difference between .find() and .aggregate()?"
**Answer:**
- `.find()` - Simple queries, filtering existing fields
- `.aggregate()` - Complex operations like calculations, transformations, grouping
- Aggregation is more powerful but slightly slower

---

### 3.8 Express Server Setup (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());                           // Allow cross-origin requests
app.use(express.json());                   // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/recipes', recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**What it does:**
- Sets up Express server
- Configures middleware
- Defines routes
- Handles errors

**Key Middleware:**

1. **cors()** - Allows frontend (different domain) to access API
   - Without CORS: Browser blocks requests from different origins
   - With CORS: Frontend at localhost:3000 can access API at localhost:5000

2. **express.json()** - Parses incoming JSON in request body
   - Converts JSON string to JavaScript object
   - Available in `req.body`

3. **express.urlencoded()** - Parses URL-encoded data
   - For form submissions
   - `extended: true` allows nested objects

**Interview Question:** "What is middleware?"
**Answer:** Middleware are functions that execute between receiving a request and sending a response. They can:
- Modify request/response objects
- Execute code
- End request-response cycle
- Call next middleware
Think of it as a pipeline: Request → Middleware 1 → Middleware 2 → Route Handler → Response

---

## 4. Important Concepts

### 4.1 Asynchronous JavaScript

```javascript
// Callback (Old way)
Recipe.find({}, function(err, recipes) {
  if (err) console.error(err);
  console.log(recipes);
});

// Promises (Better)
Recipe.find({})
  .then(recipes => console.log(recipes))
  .catch(err => console.error(err));

// Async/Await (Best - What we use)
try {
  const recipes = await Recipe.find({});
  console.log(recipes);
} catch (error) {
  console.error(error);
}
```

**Why async/await?**
- Cleaner, more readable code
- Easier error handling with try/catch
- Looks synchronous but is asynchronous

---

### 4.2 MongoDB vs SQL

| Feature | MongoDB (NoSQL) | SQL (MySQL, PostgreSQL) |
|---------|----------------|------------------------|
| Structure | Documents (JSON-like) | Tables with rows |
| Schema | Flexible | Fixed schema |
| Relationships | Embedded or referenced | Foreign keys |
| Query Language | MongoDB Query Language | SQL |
| Scaling | Horizontal (add servers) | Vertical (bigger server) |

**Why MongoDB for this project?**
- JSON data fits naturally into documents
- Flexible schema (nutrients object varies)
- Easy to scale
- Great for read-heavy operations (recipe searches)

---

### 4.3 RESTful API Principles

**REST = Representational State Transfer**

Principles we followed:
1. **Stateless** - Each request contains all needed info
2. **Resource-based URLs** - `/api/recipes` (noun, not verb)
3. **HTTP Methods** - GET for retrieving data
4. **JSON Response** - Standard data format
5. **Status Codes** - 200 (success), 500 (error)

---

### 4.4 Error Handling Best Practices

```javascript
try {
  const recipes = await Recipe.find();
  res.json({ success: true, data: recipes });
} catch (error) {
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: error.message
  });
}
```

**Why this matters:**
- Graceful error handling prevents crashes
- Informative error messages help debugging
- Always return consistent JSON structure
- Use appropriate HTTP status codes

---

## 5. Common Interview Questions & Answers

### Q1: "Walk me through your project architecture"

**Answer:**
"I built a RESTful API using the MVC pattern. The architecture has:

1. **Models layer** - Mongoose schema defines recipe structure
2. **Controllers layer** - Business logic for getting and searching recipes
3. **Routes layer** - API endpoints that map URLs to controllers
4. **Database layer** - MongoDB Atlas for cloud storage

The flow is: Client Request → Routes → Controller → Model → Database → Controller → Response to Client.

I separated concerns for maintainability - each layer has one job. This makes it easy to modify database logic without touching routing, for example."

---

### Q2: "How did you handle the NaN values requirement?"

**Answer:**
"The JSON data had NaN values in numeric fields like rating and time. I created a sanitization function that:

1. Checks if a value is NaN (string "NaN" or JavaScript NaN)
2. Converts it to NULL before database insertion
3. Ensures all numeric fields are either valid numbers or NULL

I did this in the import script's `sanitizeNumericField` function. This is important because:
- NaN breaks database queries and calculations
- NULL is the proper way to represent missing data
- It prevents errors when filtering by numeric fields

The function handles edge cases like undefined, null, empty strings, and the string 'NaN'."

---

### Q3: "Explain your pagination implementation"

**Answer:**
"I implemented offset-based pagination using MongoDB's skip and limit:

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const recipes = await Recipe.find()
  .skip(skip)
  .limit(limit);
```

For page 2 with limit 10:
- skip = (2-1) * 10 = 10
- So it skips first 10, returns next 10

I also return metadata like total count and total pages so the frontend can build pagination controls.

Benefits:
- Performance - only loads what's needed
- User experience - faster page loads
- Scalability - handles large datasets"

---

### Q4: "How does your search with filters work?"

**Answer:**
"I built a dynamic query system that supports multiple filters:

1. **Text Search** - Uses MongoDB $regex for partial matching
   - Case-insensitive search on title and cuisine
   
2. **Numeric Comparison** - Supports operators like >=, <=
   - Parses the operator from query string
   - Converts to MongoDB operators ($gte, $lte)
   
3. **Calories Filter** - Special case using aggregation
   - Extracts number from '450 kcal' string
   - Converts to number for comparison

The query building is dynamic - only adds filters that are provided, so any combination works:
- Just title
- Title + cuisine
- All filters together

MongoDB efficiently handles these queries thanks to indexes I created on commonly searched fields."

---

### Q5: "Why did you use Mongoose instead of native MongoDB driver?"

**Answer:**
"Mongoose provides several benefits:

1. **Schema definition** - Structure and validation
2. **Type casting** - Automatic data type conversion
3. **Middleware** - Pre/post hooks for operations
4. **Query builder** - Cleaner, more readable queries
5. **Validation** - Built-in data validation

For this project, the schema definition was crucial because I needed to:
- Define which fields are required
- Set default values
- Create indexes
- Define data types

Native driver requires manual validation and structure enforcement."

---

### Q6: "How would you optimize this API for production?"

**Answer:**
"Several optimizations I'd implement:

1. **Caching** - Redis for frequently accessed recipes
2. **Rate Limiting** - Prevent API abuse
3. **Compression** - Gzip responses
4. **Database Indexes** - Already added, but would monitor performance
5. **Connection Pooling** - Already handled by Mongoose
6. **API Documentation** - Swagger/OpenAPI
7. **Logging** - Winston or Morgan for request logs
8. **Security** - Helmet.js for HTTP headers, input sanitization
9. **Load Balancing** - Multiple server instances
10. **Monitoring** - PM2 or New Relic for performance monitoring"

---

### Q7: "What security considerations did you implement?"

**Answer:**
"Several security measures:

1. **Environment Variables** - Credentials not in code
2. **CORS** - Controls which domains can access API
3. **Input Validation** - Mongoose schema validation
4. **Error Handling** - Don't expose sensitive info in errors
5. **MongoDB Injection Prevention** - Mongoose escapes queries

For production, I'd add:
- Rate limiting
- HTTPS only
- Input sanitization
- Authentication/Authorization (JWT)
- Request size limits"

---

### Q8: "Explain the difference between .lean() and regular queries"

**Answer:**
"When you query MongoDB with Mongoose:

**Without .lean():**
```javascript
const recipe = await Recipe.findOne();
// Returns Mongoose document with methods
recipe.save()  // Has methods
recipe.toJSON() // Can transform
```

**With .lean():**
```javascript
const recipe = await Recipe.findOne().lean();
// Returns plain JavaScript object
recipe.save() // ERROR - no methods
```

I use .lean() in my GET routes because:
- Faster - no document hydration
- Less memory - plain objects are lighter
- Don't need Mongoose methods for read-only operations

Only use full documents when you need to save/update."

---

## 6. Code Walkthrough - Step by Step

### Request Flow Example: GET /api/recipes?page=1&limit=10

```
1. Client sends:
   GET http://localhost:5000/api/recipes?page=1&limit=10

2. Express receives request → Middleware chain:
   ↓
3. cors() → Allows request
   ↓
4. express.json() → Parses body (not needed for GET)
   ↓
5. Routes: app.use('/api/recipes', recipeRoutes)
   → Matches '/api/recipes' path
   ↓
6. recipeRoutes: router.get('/', getRecipes)
   → Calls getRecipes controller
   ↓
7. getRecipes function:
   - Extracts page=1, limit=10 from req.query
   - Calculates skip = 0
   - Queries: Recipe.find().skip(0).limit(10).sort({rating: -1})
   ↓
8. MongoDB:
   - Finds all documents
   - Sorts by rating descending
   - Returns first 10
   ↓
9. Controller formats response:
   {
     success: true,
     count: 10,
     total: 1500,
     page: 1,
     totalPages: 150,
     data: [ recipe objects ]
   }
   ↓
10. Express sends JSON response to client
```

---

## 7. Technical Terms to Know

### Backend Terms
- **API** - Application Programming Interface (how systems communicate)
- **REST** - Architectural style for APIs
- **Endpoint** - Specific URL that performs an action
- **Middleware** - Functions that process requests before reaching route handler
- **Schema** - Structure definition for data
- **ODM** - Object Document Mapper (Mongoose)
- **Query** - Request for data from database
- **Aggregation** - Complex data processing pipeline

### Database Terms
- **Document** - Single record in MongoDB (like a row in SQL)
- **Collection** - Group of documents (like a table in SQL)
- **Index** - Data structure for fast queries
- **Query Operator** - Special MongoDB operators ($gte, $regex, etc.)
- **Pipeline** - Series of stages in aggregation

### JavaScript Terms
- **async/await** - Modern way to handle asynchronous code
- **Promise** - Object representing eventual completion of async operation
- **Arrow Function** - Concise function syntax: `() => {}`
- **Destructuring** - Extract values: `const { title } = req.query`
- **Template Literal** - String with variables: `` `Text ${variable}` ``

---

## 8. Practice Explaining These Code Snippets

Be ready to explain:

### Snippet 1: Schema with Indexes
```javascript
const recipeSchema = new mongoose.Schema({
  rating: { type: Number, default: null },
  title: { type: String }
});
recipeSchema.index({ rating: -1 });
```
**Explain:** "This defines a recipe schema with rating and title fields. The index on rating with -1 means descending order, which speeds up queries that sort by rating."

### Snippet 2: Pagination Logic
```javascript
const skip = (page - 1) * limit;
const recipes = await Recipe.find().skip(skip).limit(limit);
```
**Explain:** "This implements pagination. For page 2 with limit 10, it skips the first 10 records and returns the next 10."

### Snippet 3: Dynamic Query
```javascript
let query = {};
if (title) query.title = { $regex: new RegExp(title, 'i') };
const recipes = await Recipe.find(query);
```
**Explain:** "This builds a dynamic query that only includes filters if they're provided. The regex allows partial, case-insensitive matching."

---

## 9. Common Mistakes to Avoid in Interview

❌ "I used MongoDB because everyone uses it"
✅ "I chose MongoDB because the flexible schema fits well with varying recipe data structures"

❌ "Pagination is for limiting results"
✅ "Pagination improves performance by loading data in chunks, reducing memory usage and response time"

❌ "I handled errors with try-catch"
✅ "I implemented comprehensive error handling with try-catch blocks, appropriate status codes, and user-friendly error messages"

---

## 10. Questions to Ask Interviewer (Shows Initiative!)

1. "What database do you use in production and why?"
2. "How do you handle API versioning?"
3. "What's your approach to API documentation?"
4. "Do you use caching strategies for APIs?"
5. "How do you monitor API performance in production?"

---

## Final Tips

1. **Be Honest** - If you don't know something, say "I haven't worked with that yet, but I understand the concept..."

2. **Think Out Loud** - Explain your thought process: "First I would check..., then I would..."

3. **Relate to Real World** - "It's like a library catalog system - indexes help find books faster"

4. **Show Growth Mindset** - "In my next version, I'd add caching for better performance"

5. **Practice** - Read your code out loud, explain each function to yourself

Good luck with your interview! 🚀
