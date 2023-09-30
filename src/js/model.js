import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_APGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: {},
    page: 1,
    resultsPerPage: RES_PER_APGE,
    results: [],
  },
  bookMarks:[]
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    //  const data= await getJSON(`${API_URL}/5ed6604591c37cdc054bcd09`)

    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cooking_time,
    };
    if(state.bookMarks.some(b=> b.id === id))
       state.recipe.bookmarked=true;
       else 
       state.recipe.bookmarked=false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}/?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: `#${rec.id}`,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page=1;
  } catch (err) {
    throw err;
  }
};

export const controlSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings= function(newServings){
state.recipe.ingredients.forEach(ing=>{
  ing.quantity= (ing.quantity * newServings) / state.recipe.servings;
})
state.recipe.servings=newServings;
}

const persistBookMark= function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
}

export const addBookMarks = function(recipe){
//add bookmark
 state.bookMarks.push(recipe);

 if(recipe.id === state.recipe.id){
  state.recipe.bookmarked=true;
 }
 persistBookMark();
}


export const deleteBookMarks = function(id){
  const index= state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  console.log(state.bookMarks);

  if(id === state.recipe.id) state.recipe.bookmarked=false;
  persistBookMark();
}

const init= function(){
const storage= localStorage.getItem('bookmarks');
if(storage) state.bookMarks= JSON.parse(storage);
}

init();