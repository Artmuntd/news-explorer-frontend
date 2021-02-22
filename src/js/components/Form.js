import BaseComponent from "./BaseComponent";
import errorMessages from "../constants/errorMessages";

const {
  INCORRECT_EMAIL,
  INCORRECT_EMAIL_LENGTH,
  REQUIRED_FIELD,
  SERVER_ERR_409,
  SERVER_ERR_401,
  SERVER_ERR_400,
  SEARCH_ERROR,
} = errorMessages;

// Класс, отвечающий за логику работы формы
export default class Form extends BaseComponent {
  constructor(form, api, popup, card, popupUserAdded) {
    super();
    this.form = form;
    this.api = api;
    this.popup = popup;
    this.card = card;
    this.popupUserAdded = popupUserAdded;
    this.buttonSubmit = this.form.querySelector(".button");
    this._validateForm = this._validateForm.bind(this);
    this._validateInput = this._validateInput.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this._cleanErrors = this._cleanErrors.bind(this);
    this._cleanInputs = this._cleanInputs.bind(this);
    this.getValues = this.getValues.bind(this);
    this.form.addEventListener("submit", (event) => this.submitForm(event));
    this.reset = this.reset.bind(this);
    this._setServerError = this._setServerError.bind(this);
    this.isLoggedIn = false;
  }

  getValues() {
    const values = {};
    Array.from(this.form.elements).forEach((element) => {
      if (element.nodeName === "INPUT") {
        values[element.name] = element.value;
      }
    });
    return values;
  }

  // находит инпуты в форме и отправляет их на валидацию
  getInfo() {
    Array.from(this.form.elements).forEach((input) => {
      if (input.nodeName === "INPUT") {
        this._addListener(input, "input", () => {
          this._validateInput(input);
          this._validateForm();
        });
      }
    });
  }

  setEventListeners() {
    this._addListener(this.form, "input", this._validateForm);
  }

  submitForm(e) {
    e.preventDefault();
    if (e.target.getAttribute("id") === "form-registration") {
      this.api
        .signup(this.getValues())
        .then(() => {
          this.popup.close();
          this.popupUserAdded.open();
          this.reset();
          this.isLoggedIn = false;
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else if (e.target.getAttribute("id") === "form-enter") {
      this.api
        .signin(this.getValues())
        .then((res) => {
          this.popup.close();
          this.reset();
          this.isLoggedIn = true;
          localStorage.setItem("token", res.token);
          window.location.reload();
        })
        .catch((err) => {
          this._setServerError(err);
          this.isLoggedIn = false;
        });
    }
  }

  //  добавляет форме ошибку, пришедшую с сервера
  _setServerError(err) {
    const error = this.buttonSubmit.previousElementSibling;
    if (err === 400) {
      error.textContent = SERVER_ERR_400;
    } else if (err === 401) {
      error.textContent = SERVER_ERR_401;
    } else if (err === 409) {
      error.textContent = SERVER_ERR_409;
    }
  }

  //  валидирует переданный инпут
  _validateInput(input) {
    this.input = input;
    let valid = true;
    const error = input.nextElementSibling;

    if (input.name === "email" && !input.validity.valid) {
      error.textContent = INCORRECT_EMAIL;
      valid = false;
    } else if (input.name === "password" && !input.validity.valid) {
      error.textContent = INCORRECT_EMAIL_LENGTH;
      valid = false;
    } else if (input.name === "name" && !input.validity.valid) {
      error.textContent = REQUIRED_FIELD;
      valid = false;
    } else if (input.name === "search" && !input.validity.valid) {
      error.textContent = SEARCH_ERROR;
      valid = false;
    } else if (input.validity.valid) {
      error.textContent = "";
    }
    return valid;
  }

  // валидирует всю форму
  _validateForm() {
    if (this.form.checkValidity()) {
      this.buttonSubmit.disabled = false;
    } else {
      this.buttonSubmit.disabled = true;
    }
  }

  // вспомогательный метод, очищает поля формы
  _cleanErrors() {
    this.form.querySelectorAll("input").forEach((errorField) => {
      const error = errorField.nextElementSibling;
      error.textContent = "";
    });
  }

  _cleanInputs() {
    this.form.querySelectorAll("input").forEach((input) => {
      const inputField = input;
      inputField.value = "";
    });
    this.buttonSubmit.disabled = true;
  }

  reset() {
    this._cleanErrors();
    this._cleanInputs();
  }
}
