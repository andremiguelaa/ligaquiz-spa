import Cookies from 'js-cookie';
import { catalogs } from 'utils/catalogs';

const userLanguage = navigator.language.substring(0, 2);
const defaultLanguage = Object.keys(catalogs).includes(userLanguage)
  ? userLanguage
  : 'pt';

export const settingsInitialState = {
  language: Cookies.get('language') ? Cookies.get('language') : defaultLanguage
};

export const settingsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'settings.language':
      return {
        ...state,
        language: payload
      };

    default:
      return state;
  }
};
