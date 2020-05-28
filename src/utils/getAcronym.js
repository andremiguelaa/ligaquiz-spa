const getAcronym = (string) =>
  string
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '');

export default getAcronym;
