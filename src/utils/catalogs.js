import catalogPt from 'locales/pt/messages';
import catalogEn from 'locales/en/messages';

const availableCatalogs = {
  pt: catalogPt,
  en: catalogEn,
};

export const catalogs = {
  [process.env.REACT_APP_LANGUAGE]:
    availableCatalogs[process.env.REACT_APP_LANGUAGE],
};
