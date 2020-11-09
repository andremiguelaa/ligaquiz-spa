export const formatDate = (date) =>
  `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
    '0' + date.getDate()
  ).slice(-2)}`;

export const convertToLongDate = (date, language) => {
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

export const convertToLongMonth = (date, language, onlyMonth = false) => {
  let longDate = new Date(date).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
  });
  if (language === 'pt') {
    let longDateArray = longDate.split(' ');
    if (onlyMonth) {
      longDate =
        longDateArray[0].charAt(0).toUpperCase() + longDateArray[0].slice(1);
    } else {
      longDateArray[0] =
        longDateArray[0].charAt(0).toUpperCase() + longDateArray[0].slice(1);
      longDate = longDateArray.join(' ');
    }
  }
  return longDate;
};

export default formatDate;
