const getLocaleMonth = (locale, month) => {
  const localizedMonth = new Date(2020, month - 1, 1).toLocaleString(locale, {
    month: 'long',
  });
  return localizedMonth.charAt(0).toUpperCase() + localizedMonth.slice(1);
};

export default getLocaleMonth;
