// дата - 7 дней (для поиска новостей)
const dateFromConverter = () => {
  const res = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return res;
};

// формат даты для запроса к news api
const changeDateFormat = (date) => {
  const year = new Intl.DateTimeFormat("ru", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("ru", { month: "numeric" }).format(
    date,
  );
  const day = new Intl.DateTimeFormat("ru", { day: "numeric" }).format(date);
  return `${year}-${month}-${day}`;
};

// сегодня дата
const today = () => {
  const res = new Date();
  return res;
};

// формат даты для вставки в карточку
const changeDate = (date) => {
  const day = new Intl.DateTimeFormat("ru", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("ru", { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat("ru", { year: "numeric" }).format(date);
  return `${day} ${month}, ${year}`;
};

export {
  dateFromConverter, changeDateFormat, today, changeDate,
};
