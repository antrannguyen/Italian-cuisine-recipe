// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { element, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
 * - Search object
 * - Current recipe onject
 * - Shopping list object
 * -  Liked recipes
 */
const state = {};

/* ---- SEARCH CONTROLER ----*/
const controlSearch = async () => {
	// 1. Get query form view
	// const query = searchView.getInput(); //TODO later
	const query = "pizza"; //TODO later

	if (query) {
		//2. New search object and add to state
		state.search = new Search(query);

		// 3. Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(element.searchRes);

		try {
			// 4. Search for recipes
			await state.search.getResults();
			clearLoader();
			// 5. Render results on UI
			searchView.renderResults(state.search.result);
		} catch (err) {
			alert("Something went wrong with Search....");
		}
	}
};

element.searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	controlSearch();
});

element.searchResPages.addEventListener("click", (e) => {
	const btn = e.target.closest(".btn-inline");
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

/* ---- RECIPE CONTROLER ----*/

const controlRecipe = async () => {
	//Get ID from url
	const id = window.location.hash.replace("#", "");
	// console.log(id)

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(element.recipe);

		//Highlight selected serch item
		if (state.search) searchView.highlightSelected(id);

		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate seveings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			//Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			alert("Error processing recipe!");
		}
	}
};

["hashchange", "load"].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);

/* ---- LIST CONTROLER ----*/

const controlList = () => {
	// Create a new list IF there in none yet
	if (!state.list) state.list = new List();

	//Add each ingredient to the list and UI
	state.recipe.ingredients.forEach((el) => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Handle delete and update list item events
element.shopping.addEventListener("click", (e) => {
	const id = e.target.closest(".shopping__item").dataset.itemid;

	// handle the delete button
	if (e.target.matches(".shopping__delete, .shopping__delete *")) {
		// Delete from state
		state.list.deleteItem(id);

		//Delete from UI
		listView.deleteItem(id);
	}

	// Handle the count value
	else if (e.target.matches(".shopping__count-value")) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
});

/* ---- LIKE CONTROLER ----*/

const controllerLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	//User has NOT yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.publisher,
			state.recipe.img
		);

		console.log(state.recipe);

		// Toggle the like button
		likesView.toggleLikeBtn(true);

		//Add like to UI list
		likesView.renderLikes(newLike);
	}
	//User HAS yet liked current recipe
	else {
		// Remove like fro the stae
		state.likes.deleteLike(currentID);
		// Toggle the like button
		likesView.toggleLikeBtn(false);

		// Remove like from UI list
		likesView.deleteLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

// Restore liked recipes on page load
window.addEventListener("load", () => {
	state.likes = new Likes();

	// Restore likes
	state.likes.readStorage();

	//Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumberLikes());

	// Render the existing likes
	state.likes.likes.forEach((like) => likesView.renderLikes(like));
});

// Handling recipe button clicks
element.recipe.addEventListener("click", (e) => {
	if (e.target.matches(".btn-decrease, .btn-decrease *")) {
		//Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings("dec");
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(".btn-increase, .btn-increase *")) {
		//Increase button is clicked
		state.recipe.updateServings("inc");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
		// add ingredients to shopping list
		controlList();
	} else if (e.target.matches(".recipe__love, .recipe__love *")) {
		//Like contoller
		controllerLike();
	}
	// console.log(state.recipe)
});
