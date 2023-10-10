import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_APGE, KEY } from './config';
import { AJAX } from './helper';

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

const createOjectRecipe= function(data){
  const { recipe } = data.data;
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cooking_time,
      ...(recipe.key && {key: recipe.key})
    };
}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    //  const data= await getJSON(`${API_URL}/5ed6604591c37cdc054bcd09`)

    state.recipe= createOjectRecipe(data);
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
    const data = await AJAX(`${API_URL}/?search=${query}&&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: `#${rec.id}`,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
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


export const updateNewRecipie = async function(newRecipe){
try{
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3) {
        throw new Error(
          'Wrong ingredient fromat! Please use the correct format :)'
        );
      }
      const [quantity, unit, description] = ingArr;
      return {quantity: quantity ? +quantity : null, unit, description };
    });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
console.log(data);
state.recipe= createOjectRecipe(data);
addBookMarks(state.recipe);
}
catch(err){
  throw(err);
}
}

const init= function(){
const storage= localStorage.getItem('bookmarks');
if(storage) state.bookMarks= JSON.parse(storage);
}

init();