const getLocaleMonth = (locale, month) => {
  let date = new Date();
  date.setMonth(month - 1);
  const localizedMonth = date.toLocaleString(locale, { month: 'long' });
  return localizedMonth.charAt(0).toUpperCase() + localizedMonth.slice(1);
};

export default getLocaleMonth;
