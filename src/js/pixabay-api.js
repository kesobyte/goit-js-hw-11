export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43554757-f67cd1bf9167ecad4f10e7512';

export const config = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 20,
  },
};
