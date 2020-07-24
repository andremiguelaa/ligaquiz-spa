export const formatDate = (date) =>
  `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
    '0' + date.getDate()
  ).slice(-2)}`;

export const covertToLongDate = (date, language) => {
  let longDate = new Date(date).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (language === 'pt') {
    let longDateArray = longDate.split(' ');
    longDateArray[2] =
      longDateArray[2].charAt(0).toUpperCase() + longDateArray[2].slice(1);
    longDate = longDateArray.join(' ');
  }
  return longDate;
};

export default formatDate;
