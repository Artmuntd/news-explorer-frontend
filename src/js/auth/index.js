import "../../css/save-auth.css";
import MainApi from "../api/MainApi";
import Header from "../components/Header";
import constants from "../constants/constants";
import NewsCard from "../components/NewsCard";
import NewsCardList from "../components/NewsCardList";
import helpers from "../utils/helpers";

(() => {
  const {
    MAIN_URL, TOKEN, PAGE, TEMPLATE,
  } = constants;
  const { bigLetter } = helpers;
  const mainApi = new MainApi(MAIN_URL);
  let isLoggedIn = true;
  const savedNewsArray = [];
  const arrayKeywords = [];
  const buttonMobileMenuArticles = document.getElementById("header__menu-mobile-articles-page");
  const buttonCloseMobileMenu = document.querySelector(
    ".header__menu-mobile_close",
  );
  const buttonLogout = document.querySelector(".button__logout");

  const header = new Header(PAGE);
  const newsCardList = new NewsCardList(
    TEMPLATE,
    "",
    "",
    (element, card) => new NewsCard(element, card, PAGE, mainApi, newsCardList, savedNewsArray),
    PAGE,
    isLoggedIn,
  );
  const newsCard = new NewsCard("", "", PAGE, mainApi, "", "");
  // инфа о статьях и имя
  const amountSavedArticles = document.getElementById("header__info_amoumt-articles");
  const savedName = document.getElementById("header__info-name");
  const firstTagWord = document.getElementById("header__tag-main");
  const secondTagWord = document.getElementById("header__tag-second");
  const thirdTagWord = document.getElementById("header__tag-other");
  const commaTagWord = document.getElementById("header__tag-comma");
  const andTagWord = document.getElementById("header__tag-and");
  const otherTagWord = document.getElementById("header__tag-word");

  // проверка токена, если нет - переместим на главную
  if (TOKEN) {
    mainApi
      .getUserData(TOKEN)
      .then((data) => {
        isLoggedIn = true;
        header.render(isLoggedIn, data.name);
        savedName.textContent = data.name;
      })
      .catch(() => {
        isLoggedIn = false;
        header.render(isLoggedIn, "");
      });
  } else {
    document.location.replace("./index.html");
  }

  // открыть мобильное меню
  buttonMobileMenuArticles.addEventListener("click", () => {
    header.mobileMenuArticlesOpen();
  });

  // закрыть мобильное меню
  buttonCloseMobileMenu.addEventListener("click", () => {
    header.mobileMenuArticlesClose();
  });

  // выход из профиля
  buttonLogout.addEventListener("click", () => {
    header.logOut();
  });

  // отрисовка информации о сохраненных статьях
  function showAmount(length) {
    amountSavedArticles.textContent = length;
  }

  // запрос сохраненных карточек
  mainApi.getArticles().then((res) => {
    res.data.forEach((element) => {
      savedNewsArray.push(element);
      arrayKeywords.push(element.keyword);
    });
  })
    .then(() => {
      if (savedNewsArray.length === 0) {
        showAmount(savedNewsArray.length);
      } else if (savedNewsArray.length > 0) {
        showAmount(savedNewsArray.length);
        newsCardList._openSearchResultBlock();
        savedNewsArray.forEach((element) => {
          newsCardList.addCard(element);
        });
        newsCard.renderIcon(isLoggedIn);
      }
    }).catch((err) => {
      throw new Error(err);
    });

  // отсрочка чтобы успели прийти в дом теги
  setTimeout(() => {
    // подсчет количества повторов тэгов
    const array = arrayKeywords.reduce((obj, item) => {
      if (!obj[item]) {
        obj[item] = 0;
      }
      obj[item]++;
      return obj;
    }, {});

    // перевод объекта в массив и сортировка по убыванию повторов
    const sortable = Object.entries(array)
      .sort(([, a], [, b]) => b - a)
      .reduce((previous, [key, value]) => ({ ...previous, [key]: value }), {});

    // отображение количества ключевых слов
    const tagWord = Object.keys(sortable);
    if (tagWord.length > 3) {
      firstTagWord.textContent = bigLetter(tagWord[0]);
      secondTagWord.textContent = bigLetter(tagWord[1]);
      thirdTagWord.textContent = tagWord.length - 2;
      commaTagWord.textContent = ",";
      andTagWord.textContent = "и";
      otherTagWord.textContent = "другим";
    } else if (tagWord.length === 3) {
      firstTagWord.textContent = bigLetter(tagWord[0]);
      secondTagWord.textContent = bigLetter(tagWord[1]);
      thirdTagWord.textContent = bigLetter(tagWord[2]);
      commaTagWord.textContent = ",";
      andTagWord.textContent = "и";
    } else if (tagWord.length === 2) {
      firstTagWord.textContent = bigLetter(tagWord[0]);
      secondTagWord.textContent = bigLetter(tagWord[1]);
      commaTagWord.textContent = ",";
    } else if (tagWord.length === 1) {
      firstTagWord.textContent = bigLetter(tagWord[0]);
    }
  }, 1000);
})();
