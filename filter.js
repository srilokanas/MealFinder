const categoryId = document.getElementById('category'),
  areaId = document.getElementById('area'),
  applyId = document.getElementById('apply')
;(async () => {
  await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals != null) {
        data.meals.map(
          (meal) =>
            (categoryId.innerHTML = data.meals
              .map(
                (meal) => `
            <div>
  <input type="checkbox" id="${meal.strCategory}" name="categoryCheckBox" value="${meal.strCategory}">
  <label for="${meal.strCategory}">${meal.strCategory}</label>
</div>`
              )
              .join(''))
        )
      }
    })
})()
;(async () => {
  await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals != null) {
        data.meals.map(
          (meal) =>
            (areaId.innerHTML = data.meals
              .map(
                (meal) => `
            <div>
  <input type="checkbox" id="${meal.strArea}" name="areaCheckBox" value="${meal.strArea}">
  <label for="${meal.strArea}">${meal.strArea}</label>
</div>`
              )
              .join(''))
        )
      }
    })
})()

function applyMeal(e) {
  e.preventDefault()
  single_mealEl.innerHTML = ''
  resultHeading.innerHTML = ''
  mealsEl.innerHTML = ''
  const categories = [],
    areas = []

  let categoryMarkedCheckbox = document.getElementsByName('categoryCheckBox')
  let areaMarkedCheckbox = document.getElementsByName('areaCheckBox')
  for (let categoryCheckBox of categoryMarkedCheckbox) {
    if (categoryCheckBox.checked) {
      resultHeading.innerHTML += `'${categoryCheckBox.value}' `
      categories.push(categoryCheckBox.value)
    }
  }
  for (let areaCheckBox of areaMarkedCheckbox) {
    if (areaCheckBox.checked) {
      resultHeading.innerHTML += `'${areaCheckBox.value}' `
      areas.push(areaCheckBox.value)
    }
  }
  searchMarkedMeal(categories, areas)
}
async function searchMarkedMeal(categories, areas) {
  if (categories.length > 0 && areas.length > 0) {
    const categoryMarkedId = [],
      areaMarkedId = [],
      markedMealId = []

    for (let i = 0; i < categories.length; i++) {
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categories[i]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.meals != null) {
            data.meals.map((meal) => categoryMarkedId.push(meal.idMeal))
          }
        })
    }

    for (let i = 0; i < areas.length; i++) {
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areas[i]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.meals != null) {
            data.meals.map((meal) => areaMarkedId.push(meal.idMeal))
          }
        })
    }

    for (let i of categoryMarkedId) {
      for (let j of areaMarkedId) {
        if (i == j) {
          markedMealId.push(i)
        }
      }
    }

    console.log(markedMealId)
    for (let i of markedMealId) {
      await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${i}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.meals == null) {
            resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
          } else {
            mealsEl.innerHTML += data.meals
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
    }
  } else if (categories.length > 0) {
    for (let i = 0; i < categories.length; i++) {
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categories[i]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.meals == null) {
            resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
          } else {
            mealsEl.innerHTML += data.meals
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
    }
  } else if (areas.length > 0) {
    for (let i = 0; i < areas.length; i++) {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areas[i]}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.meals == null) {
            resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
          } else {
            mealsEl.innerHTML += data.meals
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
    }
  } else {
    alert('Please select atleast one choice to apply filter!')
  }
}

applyId.addEventListener('click', applyMeal)
