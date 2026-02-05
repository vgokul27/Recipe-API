# Quick Reference Cheat Sheet - Interview

## 🎯 Project Summary (30 seconds)
"I built a RESTful API for recipe management using Node.js, Express, and MongoDB. It features pagination, advanced search with multiple filters, and handles data integrity issues like NaN values. The API serves 1500+ recipes from a JSON file, stored in MongoDB Atlas cloud database."

---

## 🏗️ Architecture (MVC Pattern)
```
Models (Recipe.js)      → Database schema & structure
Controllers             → Business logic (get/search recipes)
Routes                  → API endpoints
Server.js              → Express setup & middleware
```

---

## 🔑 Key Features You Built

1. **Pagination** - `/api/recipes?page=1&limit=10`
   - Formula: `skip = (page - 1) * limit`
   
2. **Sorting** - By rating (highest first)
   - `.sort({ rating: -1 })`

3. **Search Filters** - `/api/recipes/search?title=pie&rating=>=4.5`
   - Title (partial match)
   - Cuisine
   - Rating, Time, Calories (with operators)

4. **NaN Handling** - Convert "NaN" to NULL
   - Used in import script
   - Ensures data integrity

---

## 💡 Most Important Functions to Explain

### 1. getRecipes (Pagination)
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const recipes = await Recipe.find()
  .sort({ rating: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
```
**Why:** Performance, better UX, handles large datasets

### 2. parseComparisonQuery (Operators)
```javascript
if (value.startsWith('>=')) {
  return { $gte: parseFloat(value.substring(2)) };
}
```
**Why:** Converts ">=4.5" → `{ $gte: 4.5 }` for MongoDB

### 3. sanitizeNumericField (NaN handling)
```javascript
const sanitizeNumericField = (value) => {
  if (isNaNValue(value)) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};
```
**Why:** Data integrity, prevents errors

---

## 📊 Database Concepts

### Schema
```javascript
const recipeSchema = new mongoose.Schema({
  title: { type: String },
  rating: { type: Number, default: null }
});
```
**Purpose:** Defines structure & validation

### Indexes
```javascript
recipeSchema.index({ rating: -1 });
recipeSchema.index({ title: 'text' });
```
**Purpose:** Speed up queries (like book index vs reading every page)

---

## 🎤 Answer These Confidently

### "Why pagination?"
"Improves performance - loads data in chunks instead of all 1500+ recipes at once. Better for memory, faster response, better UX."

### "Why MongoDB?"
"Flexible schema fits varying recipe data. Great for read-heavy operations. Easy to scale. JSON documents match our data structure."

### "Why Mongoose?"
"Schema definition, validation, cleaner queries, type casting. Makes development faster and code more maintainable."

### "What's middleware?"
"Functions between request and response. Like a pipeline: Request → CORS → Body Parser → Routes → Response. Each middleware has one job."

### "Async/await vs callbacks?"
"Async/await is cleaner, more readable, easier error handling. No callback hell. Looks synchronous but is asynchronous."

---

## 🔧 Technical Terms

| Term | Meaning |
|------|---------|
| REST | Architectural style for APIs (stateless, resource-based) |
| ODM | Object Document Mapper (Mongoose) |
| Middleware | Functions that process requests |
| Aggregation | Complex data processing in MongoDB |
| Index | Data structure for fast queries |
| .lean() | Returns plain JS objects (faster) |
| $regex | MongoDB operator for pattern matching |
| $gte/$lte | Greater/Less than or equal operators |

---

## 🚀 Production Improvements You'd Add

1. **Caching** - Redis for frequently accessed data
2. **Rate Limiting** - Prevent abuse
3. **Authentication** - JWT tokens
4. **Logging** - Winston/Morgan
5. **Monitoring** - PM2
6. **API Docs** - Swagger
7. **Security** - Helmet.js, input sanitization
8. **Testing** - Jest/Mocha

---

## 🎯 Request Flow (Know This!)

```
Client → Express → CORS → Body Parser → Routes → Controller 
→ Model → MongoDB → Controller → JSON Response → Client
```

Example: `GET /api/recipes?page=1`
1. Express receives request
2. CORS allows it
3. Routes match `/api/recipes`
4. Controller extracts page=1
5. Queries MongoDB with skip/limit
6. Returns formatted JSON

---

## 🎭 Common Tricky Questions

**"What if two users request same page simultaneously?"**
"MongoDB handles concurrent reads efficiently. Each request is independent (stateless). No locking needed for reads."

**"How do you prevent SQL injection?"**
"MongoDB uses BSON, not SQL. Mongoose escapes special characters. Plus, I use parameterized queries, not string concatenation."

**"Why use environment variables?"**
"Security - don't hardcode credentials. Flexibility - different configs for dev/production. Easy deployment."

**"What's the difference between null and undefined?"**
- `null` = intentional absence (you set it)
- `undefined` = not yet assigned
- `NaN` = invalid number operation

---

## 💪 Confidence Boosters

✅ You handled a real-world data problem (NaN values)
✅ You implemented production best practices (pagination, indexing)
✅ You used industry-standard tools (Express, MongoDB, Mongoose)
✅ You structured code properly (MVC pattern)
✅ Your API follows REST principles

---

## 🗣️ Practice Sentences

1. "I chose this architecture because..."
2. "The main challenge was... and I solved it by..."
3. "If I had more time, I'd add..."
4. "This approach is better than... because..."
5. "Let me walk you through the request flow..."

---

## 📝 Remember

- **Think out loud** - Show your thought process
- **Use analogies** - "Indexes are like a book's table of contents"
- **Be honest** - "I haven't used that, but I understand..."
- **Ask questions** - Shows interest and learning mindset
- **Relate to real world** - "Like how Amazon paginates products"

---

## 🎯 The One Thing to Remember

**Your code solves REAL problems:**
- Performance (pagination)
- Data quality (NaN handling)
- User experience (fast search)
- Scalability (indexes)

Don't just explain WHAT you did - explain WHY and what PROBLEM it solves!

---

Good luck! You've got this! 💪🚀
