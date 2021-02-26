import "../css/style.css";
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
  const auth = document.getElementById("open-popupauth");
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


  if (TOKEN) {
    mainApi
      .getUserData(TOKEN)
      .then((res) => {
        isLoggedIn = true;
        header.render(isLoggedIn, res.data.name);
      })
      .catch(() => {
        isLoggedIn = false;
        header.render(isLoggedIn, "");
      });
  }

  getTopicSearch.getInfo();


  popupUserAddedEnter.addEventListener("click", () => {
    popupUserAdded.close();
    popupEnter.open(popupEnter);
    validateEnterForm.setEventListeners();
    buttonCloseMobileMenu.classList.remove("header__menu-mobile_on");
  });


  buttonMobileMenuMain.addEventListener("click", () => {
    header.mobileMenuMainOpen();
  });

  buttonCloseMobileMenu.addEventListener("click", () => {
    header.mobileMenuMainClose();
  });


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


  auth.addEventListener("click", () => {
    popupEnter.open(popupEnter);
    validateEnterForm.getInfo();
    buttonCloseMobileMenu.classList.remove("header__menu-mobile_on");
  });

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


  buttonLogout.addEventListener("click", () => {
    header.logOut();
  });
})();
