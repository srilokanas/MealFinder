const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal')
function searchMeal(e) {
  e.preventDefault()
  single_mealEl.innerHTML = ''
  const term = search.value
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <p>${meal.strMeal}</p></div>
            </div>`
            )
            .join('')
        }
      })
    search.value = ''
  } else {
    alert('Please enter a search term')
  }
}
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0]
      addMealToDOM(meal)
    })
}
function getRandomMeal() {
  mealsEl.innerHTML = ''
  resultHeading.innerHTML = ''
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0]
      addMealToDOM(meal)
    })
}
function addMealToDOM(meal) {
  const ingredients = []
  const instructions = meal.strInstructions.split('.')
  let videoId
  if (meal.strYoutube) {
    videoId = meal.strYoutube.split('v=')[1].substring(0, 11)
  }
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      )
    } else {
      break
    }
  }
  single_mealEl.innerHTML = `
  <h1>${meal.strMeal}</h1>
  <div class="single-meal">
    <div class="image">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    </div>
    <div class="single-meal-info">
        ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>Location: ${meal.strArea}</p>` : ''}
    </div>
  </div>
    <div class="details">
    <div class="ingredients">
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
    </div>   
    <div class="instructions">
    <h2>Instructions</h2>
          ${instructions.map((ing) => `<p>${ing}</p>`).join('')}
    </div>
    </div>
    <div class="video">
        <h2>Video</h2>
        <iframe width="70%" height="360px" src="https://www.youtube.com/embed/${videoId}" title="${
    meal.strMeal
  }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>`
}

submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)
mealsEl.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  })
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid')
    getMealById(mealID)
  }
})
