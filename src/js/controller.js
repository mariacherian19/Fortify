import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './Views/recipeView';
import searchView from './Views/searchView';
import resultsView from './Views/resultsView';
import paginationView from './Views/paginationView';
import bookmarksView from './Views/bookmarksView';
import View from './Views/View';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////
const showRecipie = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.controlSearchResultsPage());

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookMarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const searchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    //paginationView.render(model.state.search);
    await model.loadSearchResults(query);
    resultsView.render(model.controlSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  resultsView.render(model.controlSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlAddBookMarks = function () {
  if(!model.state.recipe.bookmarked)
  model.addBookMarks(model.state.recipe);
  else model.deleteBookMarks(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookMarks);
};

const controlBookMarks= function(){
bookmarksView.render(model.state.bookMarks);
}

const init = function () {
  bookmarksView.addHandlerBookmarksLoad(controlBookMarks);
  recipeView.addHandlerRender(showRecipie);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookMarks);
  searchView.addHandlerSearch(searchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
