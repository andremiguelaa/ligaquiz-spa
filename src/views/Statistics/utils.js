import { setupI18n } from '@lingui/core';
import { catalogs } from 'utils/catalogs';

const i18n = setupI18n();
i18n.load(catalogs);

export const genreTranslation = (slug, language) =>
  ({
    culture: i18n.use(language)._('Cultura'),
    entertainment: i18n.use(language)._('Entretenimento'),
    history: i18n.use(language)._('História'),
    science: i18n.use(language)._('Ciência'),
    sports: i18n.use(language)._('Desporto'),
    geography: i18n.use(language)._('Geografia'),
    lifestyle: i18n.use(language)._('Estilo de Vida'),
    society: i18n.use(language)._('Sociedade'),
  }[slug]);
