const notificationSort = (a, b) =>
  `${b.start_date} ${b.end_date} ${b.id}`.localeCompare(
    `${a.start_date} ${a.end_date} ${a.id}`
  );

export default notificationSort;
