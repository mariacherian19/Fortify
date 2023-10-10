import View from './View';
import icons from 'url:../../img/icons.svg';

class UploadRecipieView extends View {
  _parentEl = document.querySelector('.upload');
  _window= document.querySelector('.add-recipe-window ');
  _overLay= document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message ='Recipe was successfully uploaded!';


  constructor(){
    super();
    this.addHandlerOpenWindow();
    this.addHandlerHideWindow();
  }

  _generateMarkup() {

  }

  toggleWindow(){
   this._window.classList.toggle('hidden');
   this._overLay.classList.toggle('hidden');
  }

  addHandlerOpenWindow(){
  this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow(){
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUploadRecipe(handler){
    this._parentEl.addEventListener('submit', function(e){
        e.preventDefault();
        const dataArr= [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        handler(data);
    })
  }
}

export default new UploadRecipieView();
