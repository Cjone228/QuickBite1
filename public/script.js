const form = document.getElementById('recipe-form');
const resultsDiv = document.getElementById('results');
const anotherBtn = document.getElementById('another-btn');
const foodSelect = document.getElementById('food-type');
const loadingDiv = document.getElementById('loading');
const searchBtn = document.getElementById('search-btn');

let currentType = '';

async function fetchMeal(type) {
  resultsDiv.innerHTML = '';
  anotherBtn.style.display = 'none';
  loadingDiv.style.display = 'block';
  searchBtn.disabled = true;
  anotherBtn.disabled = true;
  foodSelect.disabled = true;

  try {
    const res = await fetch(`/api/recipes?type=${type}`);
    const meal = await res.json();

    loadingDiv.style.display = 'none';
    searchBtn.disabled = false;
    foodSelect.disabled = false;

    if (meal.message) {
      resultsDiv.innerHTML = `<p>${meal.message}</p>`;
      return;
    }

    resultsDiv.innerHTML = `
      <div class="meal-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><a href="${meal.strSource || meal.strYoutube}" target="_blank" rel="noopener noreferrer">View Recipe</a></p>
      </div>
    `;

    anotherBtn.style.display = 'inline-block';
    anotherBtn.disabled = false;
  } catch (err) {
    loadingDiv.style.display = 'none';
    searchBtn.disabled = false;
    foodSelect.disabled = false;
    anotherBtn.style.display = 'none';

    resultsDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
    console.error(err);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  currentType = foodSelect.value;
  fetchMeal(currentType);
});

anotherBtn.addEventListener('click', () => {
  if (currentType) {
    fetchMeal(currentType);
  }
});
