import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import EventManager from './EventManager.js';
import ThemeManager from './ThemeManager.js';
import View from './View.js';

const eventManager = new EventManager();
const themeManager = new ThemeManager();
const view = new View();

let page = 1;
let matches = books;

const starting = document.createDocumentFragment();

// Populate the initial book list
view.updateBookList(matches);

const genreSelect = document.querySelector('[data-search-genres]');
view.populateSelect(genreSelect, genres, 'All Genres');

const authorSelect = document.querySelector('[data-search-authors]');
view.populateSelect(authorSelect, authors, 'All Authors');

// Handle form submission for filtering
eventManager.addEventListener(document.querySelector('[data-search-form]'), 'submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  const result = books.filter((book) => {
    const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
    return (
      (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === 'any' || book.author === filters.author) &&
      genreMatch
    );
  });

  page = 1;
  matches = result;
  view.updateBookList(matches);
  view.closeSearchOverlay();
});

// Handle "Show more" button click
eventManager.addEventListener(document.querySelector('[data-list-button]'), 'click', () => {
  const fragment = document.createDocumentFragment();
  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const element = view.createPreviewButton({ author, id, image, title });
    fragment.appendChild(element);
  }
  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
});

// Handle book item click to display details
eventManager.addEventListener(document.querySelector('[data-list-items]'), 'click', (event) => {
  const previewElement = event.path.find((node) => node?.dataset?.preview);
  if (previewElement) {
    const active = books.find((book) => book.id === previewElement.dataset.preview);
    if (active) {
      view.showBookDetails(active);
    }
  }
});

// Set the initial theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.querySelector('[data-settings-theme]').value = 'night';
  themeManager.setTheme('night');
} else {
  document.querySelector('[data-settings-theme]').value = 'day';
  themeManager.setTheme('day');
}

// Handle theme change
eventManager.addEventListener(document.querySelector('[data-settings-form]'), 'submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  themeManager.setTheme(theme);
  view.closeSettingsOverlay();
});

// Event listeners for UI actions (search, settings, etc.)
eventManager.addEventListener(document.querySelector('[data-search-cancel]'), 'click', () => {
  view.closeSearchOverlay();
});

eventManager.addEventListener(document.querySelector('[data-settings-cancel]'), 'click', () => {
  view.closeSettingsOverlay();
});

eventManager.addEventListener(document.querySelector('[data-header-search]'), 'click', () => {
  view.showSearchOverlay();
  view.focusOnSearchTitle();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
  view.showSettingsOverlay();
});
