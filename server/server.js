console.log('Starting server...');
const express = require('express');
const path = require('path');
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware to log reqs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // pass control to the next middleware or route handler
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Random Recipe Suggestion Route
app.get('/api/recipes', async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ message: 'Please provide a food type.' });
  }

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${type}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return res.status(404).json({ message: 'No meals found for that type.' });
    }

    const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];

    const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
    const detailData = await detailRes.json();

    res.json(detailData.meals[0]);
  } catch (error) {
    console.error('Error fetching random meal:', error);
    res.status(500).json({ message: 'Failed to fetch meal suggestion.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});