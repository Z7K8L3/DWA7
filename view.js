class View {
    constructor() {
      this.elements = {
        searchOverlay: document.querySelector('[data-search-overlay]'),
        searchTitle: document.querySelector('[data-search-title]'),
        // Add more elements as needed
      };
    }
  
    showSearchOverlay() {
      this.elements.searchOverlay.open = true;
      this.elements.searchTitle.focus();
    }
  }
  
  export default View;
  