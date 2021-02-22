import "../css/index.css";
import MainApi from "./api/MainApi";
import NewsApi from "./api/NewsApi";
import Popup from "./components/Popup";
import Form from "./components/Form";
import NewsCard from "./components/NewsCard";
import NewsCardList from "./components/NewsCardList";
import Header from "./components/Header";
import constants from "./constants/constants";
import {
  dateFromConverter,
  changeDateFormat,
  today,
} from "./utils/dateConverter";

(() => {
  const {
    API_KEY, NEWS_URL, MAIN_URL, TOKEN, PAGE, TEMPLATE,
  } = constants;

  // дата сегодня
  const dateSevenDaysAgo = changeDateFormat(dateFromConverter());
  const dateToday = changeDateFormat(today());

  const buttonsClose = document.querySelectorAll(".popup__close");
  const buttonLogout = document.querySelector(".button__logout");
  const auth = document.getElementById("open-popupEnter");
  const registration = document.getElementById("open-popupRegistration");
  const enterForm = document.getElementById("form-enter");
  const searchForm = document.getElementById("form-search");
  const registrationForm = document.getElementById("form-registration");
  const searchButton = document.getElementById("search-button");
  const buttonMobileMenuMain = document.getElementById(
    "header__menu-mobile-main-page",
  );
  const buttonCloseMobileMenu = document.querySelector(
    ".header__menu-mobile_close",
  );
  const popupOtherRegistration = document.getElementById("popup__other");
  const popupUserAddedEnter = document.querySelector(".popup__other-registration_added");
  let isLoggedIn = false;

  const mainApi = new MainApi(MAIN_URL);
  const newsApi = new NewsApi(NEWS_URL, API_KEY, dateSevenDaysAgo, dateToday);
  const popupEnter = new Popup(document.getElementById("popup__enter"));
  const popupRegistration = new Popup(
    document.getElementById("popupRegistration"),
  );
  const popupUserAdded = new Popup(
    document.getElementById("popupUserAdded"),
  );
  const newsCard = new NewsCard("", TEMPLATE, "");
  const validateEnterForm = new Form(enterForm, mainApi, popupEnter, newsCard, "");
  const validateRegistrationForm = new Form(
    registrationForm,
    mainApi,
    popupRegistration,
    newsCard,
    popupUserAdded,
  );
  const getTopicSearch = new Form(searchForm, "", "");
  const header = new Header(PAGE);

  // проверка авторизации при загрузке страницы
  if (TOKEN) {
    mainApi
      .getUserData(TOKEN)
      .then((data) => {
        isLoggedIn = true;
        header.render(isLoggedIn, data.name);
      })
      .catch(() => {
        isLoggedIn = false;
        header.render(isLoggedIn, "");
      });
  }
  //  валидация строки поиска
  getTopicSearch.getInfo();

  // выполнить вход после успешной регистрации
  popupUserAddedEnter.addEventListener("click", () => {
    popupUserAdded.close();
    popupEnter.open(popupEnter);
    validateEnterForm.setEventListeners();
    buttonCloseMobileMenu.classList.remove("header__menu-mobile_on");
  });

  // открыть мобильное меню
  buttonMobileMenuMain.addEventListener("click", () => {
    header.mobileMenuMainOpen();
  });
  // закрыть мобильное меню
  buttonCloseMobileMenu.addEventListener("click", () => {
    header.mobileMenuMainClose();
  });

  // закрыть попап по крестику
  buttonsClose.forEach((element) => {
    element.addEventListener("click", () => {
      popupEnter.close();
      popupRegistration.close();
      popupUserAdded.close();
      validateEnterForm.reset();
      validateRegistrationForm.reset();
      buttonMobileMenuMain.classList.toggle("header__menu-mobile_off");
    });
  });

  // закрыть попап ecs
  document.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.code === "Escape") {
      popupEnter.close();
      popupRegistration.close();
      popupUserAdded.close();
      validateEnterForm.reset();
      validateRegistrationForm.reset();
    }
  });

  // открыть попап авторизации
  auth.addEventListener("click", () => {
    popupEnter.open(popupEnter);
    validateEnterForm.getInfo();
    buttonCloseMobileMenu.classList.remove("header__menu-mobile_on");
  });
  // открыть попап ренистрации (в попапе авторизации)
  registration.addEventListener("click", () => {
    popupEnter.close(popupEnter);
    popupRegistration.open(popupRegistration);
    validateRegistrationForm.getInfo();
    popupOtherRegistration.addEventListener("click", () => {
      popupRegistration.close();
      validateRegistrationForm.reset();
      popupEnter.open(popupEnter);
    });
  });

  // поиск новостей (клик по кнопке "поиск")
  searchButton.addEventListener("click", () => {
    const newsCardList = new NewsCardList(
      TEMPLATE,
      newsApi,
      getTopicSearch,
      (element, card) => new NewsCard(element, card, PAGE, mainApi, newsCardList, ""),
      PAGE,
      isLoggedIn,
    );

    newsCardList.searchingNews();
  });

  // выход из профиля
  buttonLogout.addEventListener("click", () => {
    header.logOut();
  });
})();
