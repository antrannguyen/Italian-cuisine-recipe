import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.autor = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            console.log(res.data.recipe);
        } catch (e) {
            alert('Something went wrong with ID');
        };
    }
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {

            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            })
            //2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^]*\) */g, '');

            //3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objInt;
            if (unitIndex > -1) {
                // There is a unit
                // Case1: 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5 TH else
                // Case2: 4-1/2 cups, arrCount is [4+1/2] -->TH if = 4.5

                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = (eval(arrCount[0].replace('-', '+')));//case 2
                }
                else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objInt = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
                // console.log("sf", count)
            }
            else if (parseInt(arrIng[0], 10)) {
                //There is NO unit, but 1st element is number (4 cups)
                objInt = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                // There is NO unit and NaN in first position
                objInt = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objInt;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })
        this.servings = newServings;
    }


};



