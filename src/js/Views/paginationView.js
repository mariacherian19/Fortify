import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateButtons(type, crPage) {
    if (type == 'next') {
      return `  <button data-goto=${crPage + 1} class="btn--inline pagination__btn--next">
        <span>Page ${crPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }

    if (type == 'prev') {
      return `
        <button data-goto=${crPage - 1}  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${crPage - 1}</span>
          </button>
        `;
    }
  }

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;

    if (currPage === 1 && numOfPages > 1) {
      return `${this._generateButtons('next', currPage)}`;
    }

    if (currPage == numOfPages && currPage > 1) {
      return `${this._generateButtons('prev', currPage)}`;
    }

    if (currPage < numOfPages) {
      return `${this._generateButtons('prev', currPage)}
        ${this._generateButtons('next', currPage)}`;
    }

    return;
  }

  addHandlerClick(handler){
   this._parentEl.addEventListener('click', function(e){
    const btn= e.target.closest('.btn--inline ');
    if(!btn) return;
    const goToPage= +btn.dataset.goto;
    handler(goToPage);
   })
  }
}

export default new PaginationView();
