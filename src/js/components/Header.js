import BaseComponent from "./BaseComponent";

export default class Header extends BaseComponent {
  constructor(page) {
    super();
    this.page = page;
    this.buttonAuth = this.page.getElementById("open-popupEnter");
    this.buttonSaved = this.page.querySelector(".header__button_saved");
    this.buttonWithName = this.page.querySelector(
      ".header__button_name",
    );
    this.userName = this.page.querySelector(
      ".button__selected_with-name",
    );
    this.userNameBorder = this.page.querySelector(".header__button_name");
    this.logoutButton = this.page.querySelector(".button__logout");
    this.buttonCloseMobileMenu = this.page.querySelector(
      ".header__menu-mobile_close",
    );
    this.buttonMobileMenuMain = this.page.getElementById(
      "header__menu-mobile-main-page",
    );
    this.mobileMenuMain = this.page.querySelector(".header__buttons");
    this.headerMenu = this.page.querySelector(".header__menu");
    this.headerLogo = this.page.querySelector(".header__logo");
    this.addCloseButtonHeader = this.page.querySelector(
      ".header__menu-mobile_close",
    );
    this.underlineBlack = this.page.getElementById("underline");
    this.buttonsMain = this.page.querySelectorAll(".button__main");
    this.headerInfo = this.page.querySelector(".header__info");
    this.searchResult = this.page.querySelector(".search-result");
    this.buttonMobileMenuArticles = this.page.getElementById("header__menu-mobile-articles-page");
  }

  mobileMenuMainOpen() {
    this.mobileMenuMain.classList.add("header__buttons_open");
    this.headerMenu.classList.add("header_dark");
    this.buttonMobileMenuMain.classList.add("header__menu-mobile_off");
    this.addCloseButtonHeader.classList.add("header__menu-mobile_on");
    this.headerInfo.classList.add("header__info_filter");
    this.searchResult.classList.add("search-result_filter");
  }

  mobileMenuMainClose() {
    this.mobileMenuMain.classList.toggle("header__buttons_open");
    this.headerMenu.classList.toggle("header_dark");
    this.buttonMobileMenuMain.classList.toggle("header__menu-mobile_off");
    this.buttonCloseMobileMenu.classList.remove("header__menu-mobile_on");
    this.headerInfo.classList.remove("header__info_filter");
    this.searchResult.classList.remove("search-result_filter");
  }

  mobileMenuArticlesOpen() {
    this.mobileMenuMain.classList.add("header__buttons_open");
    this.headerMenu.classList.add("header_dark");
    this.headerLogo.classList.add("button_white");
    this.buttonsMain.forEach((element) => {
      element.classList.remove("button_black");
    });
    this.userName.classList.remove("button_black");
    this.userNameBorder.classList.remove("button__selected_black");
    this.logoutButton.classList.remove("button__logout_black");
    this.buttonMobileMenuArticles.classList.add("header__menu-mobile_off");
    this.addCloseButtonHeader.classList.add("header__menu-mobile_on");
    this.underlineBlack.classList.remove("header__button_underline-black");
    // this.headerInfo.classList.add("header__info_filter");
    this.searchResult.classList.add("search-result_filter");
  }

  mobileMenuArticlesClose() {
    this.mobileMenuMain.classList.remove("header__buttons_open");
    this.headerMenu.classList.remove("header_dark");
    this.headerLogo.classList.remove("button_white");
    this.buttonsMain.forEach((element) => {
      element.classList.add("button_black");
    });
    this.userName.classList.add("button_black");
    this.logoutButton.classList.add("button__logout_black");
    this.userNameBorder.classList.add("button__selected_black");
    this.buttonMobileMenuArticles.classList.remove("header__menu-mobile_off");
    this.addCloseButtonHeader.classList.remove("header__menu-mobile_on");
    this.underlineBlack.classList.remove("header__button_underline-black");
    this.headerInfo.classList.add("header__info_filter");
    this.searchResult.classList.remove("search-result_filter");
  }

  render(isLoggedIn, name) {
    if (isLoggedIn) {
      if (this.buttonWithName && this.buttonSaved && this.buttonAuth) {
        this.buttonWithName.classList.remove("header__button_off");
        this.buttonSaved.classList.remove("header__button_off");
        this.buttonAuth.classList.add("header__button_off");
        this.userName.textContent = name;
      } else {
        this.userName.textContent = name;
      }
    }
  }

  logOut() {
    localStorage.removeItem("token");
    window.location.reload();
  }
}
