import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.headers.common = { 'X-Requested-With': 'XMLHttpRequest' };
axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://api.ligaquiz.test/'
    : 'https://api.ligaquiz.pt/';

export const setBearerToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

setBearerToken(Cookies.get('BEARER-TOKEN'));

export default axios;
