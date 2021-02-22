import BaseComponent from "./BaseComponent";
import { changeDate } from "../utils/dateConverter";

//  Класс карточки новости
export default class NewsCard extends BaseComponent {
  constructor(data, template, page, mainApi, newsCardList, savedNewsArray) {
    super();
    this.data = data;
    this.template = template;
    this.page = page;
    this.mainApi = mainApi;
    this.newsCardList = newsCardList;
    this.savedNewsArray = savedNewsArray;
    this.setDataCard = this.setDataCard.bind(this);
    this._searchResultLoginAsk = this._searchResultLoginAsk.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
    this._iconActive = this._iconActive.bind(this);
    this.saveArticle = this.saveArticle.bind(this);
    this.getDataToSaveArticle = this.getDataToSaveArticle.bind(this);
    this._handlerIconActive = this._handlerIconActive.bind(this);
    this._handlerLoginAskOn = this._handlerLoginAskOn.bind(this);
    this._handlerLoginAskOff = this._handlerLoginAskOff.bind(this);
  }

  // отвечает за отрисовку иконки карточки. У этой иконки три состояния: иконка незалогиненного
  // пользователя, активная иконка залогиненного, неактивная иконка залогиненного.
  renderIcon(isLoggedIn) {
    const cardMarks = this.page.querySelectorAll(".search-result__addIcon");
    const deleteMarks = this.page.querySelectorAll(".search-result__deleteIcon");

    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn && cardMarks.length > 0) {
      cardMarks.forEach((cardMark) => {
        cardMark.classList.add("search-result__add-button");
        this._iconActive(cardMark);
      });
    } else if (isLoggedIn && deleteMarks.length > 0) {
      deleteMarks.forEach((deleteMark) => {
        deleteMark.classList.add("search-result__delete-button");
        deleteMark.classList.add("search-result__add-button");
        this._searchResultLoginAsk(deleteMark);
        this._iconActive(deleteMark);
      });
    } else {
      cardMarks.forEach((cardMark) => {
        cardMark.classList.add("search-result__add-button");
        this._searchResultLoginAsk(cardMark);
      });
    }
  }

  // слушатель на клик по иконке добавить себе (синяя заливка)
  _iconActive(mark) {
    this._addListener(mark, "click", () => this._handlerIconActive(mark));
  }

  // подсказка рядом с кнопкой удалить/добавить себе
  _searchResultLoginAsk(mark) {
    this._addListener(mark, "mouseover", (event) => this._handlerLoginAskOn(event));
    this._addListener(mark, "mouseout", (event) => this._handlerLoginAskOff(event));
  }

  createCard() {
    this.page
      .querySelector(".search-result__cards")
      .append(
        this.page.getElementById("card-template").content.cloneNode(true),
      );
  }

  setDataCard() {
    const image = this.template.querySelector(".search-result__image");
    const date = this.template.querySelector(".search-result__date");
    const title = this.template.querySelector(".title__search-result-article");
    const text = this.template.querySelector(".subtitle__article");
    const source = this.template.querySelector(".search-result__source");
    const link = this.template.querySelector(".search-result__info-box");
    const tag = this.template.querySelector(".search-result__tag_on");

    if (this.data._id) {
      this.template.setAttribute("id", `${this.data._id}`);
      tag.textContent = this.data.keyword;
      date.textContent = this.data.date;
      image.src = this.data.image;
      title.textContent = this.data.title;
      text.textContent = this.data.text;
      source.textContent = this.data.source;
      this.template.querySelector(".search-result__info-box").setAttribute("onclick", `'${this.data.link}'`);
    } else {
      const newdate = this.data.publishedAt.value;

      image.src = this.data.urlToImage;
      date.textContent = changeDate(newdate);
      title.textContent = this.data.title;
      text.textContent = this.data.description;
      source.textContent = this.data.source.name;
      link.setAttribute("onclick", `window.open('${this.data.url}')`);
    }
  }

  // получить данные для отпрвки на сервер
  getDataToSaveArticle(event) {
    const card = event.closest(".search-result__card");

    return {
      keyword: this.newsCardList.renderTopic().toString().toLowerCase(),
      image: card.querySelector(".search-result__image").src,
      date: card.querySelector(".search-result__date").textContent,
      title: card.querySelector(".title__search-result-article").textContent,
      text: card.querySelector(".subtitle__article").textContent,
      source: card.querySelector(".search-result__source").textContent,
      link: card.querySelector(".search-result__info-box").getAttribute("onclick").slice(13, -2),
    };
  }

  //  запрос к api на сохранение карточки
  saveArticle(icon) {
    const card = icon.closest(".search-result__card");
    const cardData = this.getDataToSaveArticle(card);
    this.mainApi.createArticle(cardData)
      .then((res) => {
        card.setAttribute("id", `${res.data._id}`);
        icon.classList.add("search-result__add-button_active");
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  // запрос к api на удаление карточки
  deleteArticle(articleId, mark, card) {
    this.mainApi.removeArticle(articleId).then(() => {
      mark.classList.remove("search-result__add-button_active");
      card.removeAttribute("id");
      if (mark.classList.contains("search-result__deleteIcon")) {
        card.remove();
      }
    })
      .catch((err) => {
        throw new Error(err);
      });
  }

  _handlerIconActive(mark) {
    if (mark.classList.contains("search-result__add-button_active") || mark.classList.contains("search-result__deleteIcon")) {
      const card = mark.closest(".search-result__card");
      const id = card.getAttribute("id");

      this.deleteArticle(id, mark, card);
    } else {
      this.saveArticle(mark);
    }
  }

  _handlerLoginAskOn(event) {
    this.event = event;
    event.target.previousElementSibling.previousElementSibling.classList.add("search-result__login-ask_on");
  }

  _handlerLoginAskOff(event) {
    this.event = event;
    event.target.previousElementSibling.previousElementSibling.classList.remove("search-result__login-ask_on");
  }
}
