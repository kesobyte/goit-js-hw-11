import axios from 'axios';
import { BASE_URL, config } from './pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

//Target Elements
const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"');
const searchFormEl = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.loadMoreBtn');

//SimpleLightBox
const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
});

let totalHits = 0;
let reachedEnd = false;

//Render of gallery upon searching
function renderGallery(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
              <a href="${largeImageURL}" class="lightbox">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${downloads}
                          </p>
                      </div>
                  </div>
              </a>
              `;
      }
    )
    .join('');

  //Checking hits data
  //console.log(hits);
  //console.log(markup);

  galleryEl.insertAdjacentHTML('beforeend', markup);

  //Reached end of collection
  if (config.params.page * config.params.per_page >= totalHits) {
    if (!reachedEnd) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      reachedEnd = true;
      loadMoreBtn.classList.add('loadMoreBtn', 'is-hidden');
    }
  }
  lightbox.refresh();
}

//Search event
async function handleSubmit(e) {
  e.preventDefault();
  config.params.q = searchInputEl.value.trim();
  if (config.params.q === '') {
    return;
  }
  config.params.page = 1;
  galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    const response = await axios.get(BASE_URL, config);
    totalHits = response.data.totalHits;
    const { hits } = response.data;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery(hits);
      //loadMoreBtn.classList.remove('is-hidden');
    }
    searchInputEl.value = '';
  } catch (err) {
    Notify.failure(err);
  }
}

searchFormEl.addEventListener('submit', handleSubmit);

//Infinite Scroll
async function loadMore() {
  config.params.page += 1;
  try {
    const response = await axios.get(BASE_URL, config);
    const hits = response.data.hits;
    renderGallery(hits);
  } catch (err) {
    Notify.failure(err);
  }
}

function handleScroll() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
}

window.addEventListener('scroll', handleScroll);

//Load More
// async function loadMore() {
//   config.params.page += 1;
//   try {
//     const response = await axios.get(BASE_URL, config);
//     const hits = response.data.hits;
//     renderGallery(hits);
//   } catch (err) {
//     Notify.failure(err);
//   }
// }

// loadMoreBtn.addEventListener('click', loadMore);
