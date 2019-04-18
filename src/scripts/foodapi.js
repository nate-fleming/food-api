const drinkButton = document.querySelector('#btn-getData')
const foodButton = document.querySelector('#btn-getFoodData')
const el = document.querySelector('#container');


foodFactory = (foodItem) => {
    return `
    <div class="food-item">
        <h2>${foodItem.name}</h2>
        <p>Ingredients: ${foodItem.ingredients}</p>
        <p>Origin: ${foodItem.origin}</p>
        <p>Calories Per Serving ${foodItem.calories}</p>
        <p>Fat Per Serving: ${foodItem.fat}</p>
        <p>Sugar Per Serving: ${foodItem.sugar}</p>
    </div>
    `
}

addFoodToDom = (foodAsHTML) => {
    el.innerHTML += foodAsHTML;
}

function getData (resource) {
    el.innerHTML = ''
    fetch(`http://localhost:8088/${resource}`)
        .then(foods => foods.json())
        .then(parsedFoods => {
            parsedFoods.forEach(food => {
                const foodAsHTML = foodFactory(food);
                addFoodToDom(foodAsHTML);
            })
        })
    }   
    
drinkButton.addEventListener('click', () => {
    getData('drinks')
})

foodButton.addEventListener('click', () => {
    getData('food')
})

// fetch("https://world.openfoodfacts.org/api/v0/product/0011150479547.json")
//     .then(response => response.json())
//     .then(productInfo => {
//         console.table(productInfo)
//     })

fetch("http://localhost:8088/food")
    .then(response => response.json())
    .then(myParsedFoods => {
        myParsedFoods.forEach(food => {
            //console.log(food.barcode) // Should have a `barcode` property
            const itemBarcode = food.barcode

            //Now fetch the food from the Food API
            fetch(`https://world.openfoodfacts.org/api/v0/product/${itemBarcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    food.ingredients = productInfo.product.ingredients_text
                    food.origin = productInfo.product.countries
                    food.calories = productInfo.product.nutriments.energy
                    food.fat = productInfo.product.nutriments.fat
                    food.sugar = productInfo.product.nutriments.sugars
                    
                    // Produce HTML representation
                    const foodAsHTML = foodFactory(food)
                    

                    // Add representaiton to DOM
                    addFoodToDom(foodAsHTML)
                })
        })
    })


