import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Utility function to create a DOM element with attributes and inner HTML
function createElement(tag, attributes, innerHTML) {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

// Utility function to populate select options from an object
function populateSelect(selectElement, data, defaultOptionText) {
  const fragment = document.createDocumentFragment();
  if (defaultOptionText) {
    const defaultOption = createElement('option', { value: 'any', innerText: defaultOptionText });
    fragment.appendChild(defaultOption);
  }
  for (const [id, name] of Object.entries(data)) {
    const option = createElement('option', { value: id, innerText: name });
    fragment.appendChild(option);
  }
  selectElement.appendChild(fragment);
}

// Utility function to update the book list
function updateBookList(filteredBooks) {
  const listItems = document.querySelector('[data-list-items]');
  const message = document.querySelector('[data-list-message]');
  const remaining = filteredBooks.length - (page * BOOKS_PER_PAGE);

  if (filteredBooks.length < 1) {
    message.classList.add('list__message_show');
  } else {
    message.classList.remove('list__message_show');
  }

  listItems.innerHTML = '';
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of filteredBooks.slice(0, BOOKS_PER_PAGE)) {
    const element = createElement('button', { classList: 'preview', 'data-preview': id });
    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    newItems.appendChild(element);
  }

  listItems.appendChild(newItems);
  document.querySelector('[data-list-button]').disabled = remaining < 1;
  document.querySelector('[data-list-button]').innerHTML = `<span>Show more</span><span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let page = 1;
let matches = books;

const starting = document.createDocumentFragment();

// Populate the initial book list
updateBookList(matches);

const genreSelect = document.querySelector('[data-search-genres]');
populateSelect(genreSelect, genres, 'All Genres');

const authorSelect = document.querySelector('[data-search-authors]');
populateSelect(authorSelect, authors, 'All Authors');

// Handle form submission for filtering
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
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
  updateBookList(matches);
  document.querySelector('[data-search-overlay]').open = false;
});

// Handle "Show more" button click
document.querySelector('[data-list-button]').addEventListener('click', () => {
  const fragment = document.createDocumentFragment();
  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const element = createElement('button', { classList: 'preview', 'data-preview': id });
    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    fragment.appendChild(element);
  }
  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
});

// Handle book item click to display details
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
  const previewElement = event.path.find((node) => node?.dataset?.preview);
  if (previewElement) {
    const active = books.find((book) => book.id === previewElement.dataset.preview);
    if (active) {
      const listActive = document.querySelector('[data-list-active]');
      listActive.open = true;
      document.querySelector('[data-list-blur]').src = active.image;
      document.querySelector('[data-list-image]').src = active.image;
      document.querySelector('[data-list-title]').innerText = active.title;
      document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText = active.description;
    }
  }
});

// Set the initial theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.querySelector('[data-settings-theme]').value = 'night';
  document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
  document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
  document.querySelector('[data-settings-theme]').value = 'day';
  document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
  document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Handle theme change
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  if (theme === 'night') {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }
  document.querySelector('[data-settings-overlay]').open = false;
});

// Event listeners for UI actions (search, settings, etc.)
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = true;
  document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = true
