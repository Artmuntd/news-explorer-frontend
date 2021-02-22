const constants = {
  API_KEY: "6911322d57a545738f4f119dd1aaca11",
  NEWS_URL: "https://nomoreparties.co/news/v2/everything",
  MAIN_URL: "http://www.artmuntd.students.nomoreparties.xyz",
  TOKEN: localStorage.getItem("token"),
  PAGE: document,
  TEMPLATE: document.getElementById("card-template"),
};

export default constants;
//https://nomoreparties.co/news/v2/top-headlines?country=us&apiKey=[ваш_ключ]  при деплое надо будет поставить.