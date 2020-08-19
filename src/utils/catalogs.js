import catalogPt from 'locales/pt/messages';
import catalogEn from 'locales/en/messages';

const availableLanguages = JSON.parse(process.env.REACT_APP_LANGUAGES);
const availableCatalogs = {
    pt: catalogPt,
    en: catalogEn
};

export const catalogs = availableLanguages.reduce((acc, item) =>{
    if(availableCatalogs[item]){
        acc[item] = availableCatalogs[item];
    }
    return acc;
}, {});  
