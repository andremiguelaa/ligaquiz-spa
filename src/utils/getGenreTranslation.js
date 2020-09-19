import { setupI18n } from '@lingui/core';
import { catalogs } from 'utils/catalogs';

const i18n = setupI18n();
i18n.load(catalogs);

export const getGenreTranslationAbbr = (slug, language) => {
  i18n.activate(language);
  return {
    culture: i18n._('Cul'),
    entertainment: i18n._('Ent'),
    history: i18n._('His'),
    science: i18n._('Ciê'),
    sports: i18n._('Des'),
    geography: i18n._('Geo'),
    lifestyle: i18n._('EdV'),
    society: i18n._('Soc'),
  }[slug];
};

export const getGenreTranslation = (slug, language) => {
  i18n.activate(language);
  return {
    culture: i18n._('Cultura'),
    entertainment: i18n._('Entretenimento'),
    history: i18n._('História'),
    science: i18n._('Ciência'),
    sports: i18n._('Desporto'),
    geography: i18n._('Geografia'),
    lifestyle: i18n._('Estilo de Vida'),
    society: i18n._('Sociedade'),
    architecture: i18n._('Arquitectura'),
    fine_arts: i18n._('Belas Artes'),
    literature: i18n._('Literatura'),
    dance: i18n._('Dança'),
    operas_and_musicals: i18n._('Óperas e Musicais'),
    theater: i18n._('Teatro'),
    comics: i18n._('Banda Desenhada'),
    music: i18n._('Música'),
    tv: i18n._('Televisão'),
    movies: i18n._('Cinema'),
    fauna_and_flora: i18n._('Fauna e Flora'),
    math: i18n._('Matemática'),
    physics: i18n._('Física'),
    chemistry: i18n._('Química'),
    biology: i18n._('Biologia'),
    geology: i18n._('Geologia'),
    space: i18n._('Espaço'),
    health_and_human_body: i18n._('Saúde e Corpo Humano'),
    games_and_hobbies: i18n._('Jogos e Passatempos'),
    design: i18n._('Design'),
    fashion: i18n._('Moda'),
    handicraft: i18n._('Artesanato'),
    religion_and_beliefs: i18n._('Religião e Crenças'),
    mythology: i18n._('Mitologia'),
    traditions: i18n._('Tradições'),
    food_and_beverage: i18n._('Comida e Bebida'),
    tourism: i18n._('Turismo'),
    museums: i18n._('Museus'),
    transportation: i18n._('Transportes'),
    philosophy: i18n._('Filosofia'),
    social_sciences: i18n._('Ciências Sociais'),
    technology_and_inventions: i18n._('Tecnologia e Invenções'),
    products_and_brands: i18n._('Produtos e Marcas'),
    press_and_social_networks: i18n._('Comunicação Social e Redes Sociais'),
    nowadays_politics: i18n._('Política Actual'),
    trivialities: i18n._('Trivialidades'),
  }[slug];
};
