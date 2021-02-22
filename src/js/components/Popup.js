import BaseComponent from "./BaseComponent";
//  Класс попапа
export default class Popup extends BaseComponent {
  constructor(elenent) {
    super();
    this.elenent = elenent;
    // this.buttonClose = this.element.querySelector(".popup__close");
  }

  open() {
    this.elenent.classList.add("popup_is-opened");
  }

  close() {
    this.elenent.classList.remove("popup_is-opened");
  }

  // очищает содержимое попапа
  // clearContent() {}

  // // вставляет в попап содержимое, например, форму входа или сообщение об успешной регистрации
  // setContent(popup) {

  // }
}
