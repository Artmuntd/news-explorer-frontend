import BaseComponent from "./BaseComponent";

export default class Popup extends BaseComponent {
  constructor(elenent) {
    super();
    this.elenent = elenent;

  }

  open() {
    this.elenent.classList.add("popup_is-opened");
  }

  close() {
    this.elenent.classList.remove("popup_is-opened");
  }


}
