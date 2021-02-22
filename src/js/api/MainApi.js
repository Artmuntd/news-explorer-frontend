import ErrorHandler from "../utils/ErrorHandler";

export default class MainApi {
  constructor(mainURL) {
    this.mainURL = mainURL;
  }

  // регистрация
  signup(userData) {
    const { name, email, password } = userData;
    return fetch(`${this.mainURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      // credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }

  // авторизация
  signin(userData) {
    const { email, password } = userData;
    return fetch(`${this.mainURL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }

  getUserData() {
    return fetch(`${this.mainURL}/users/me`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      mode: "cors",
      // credentials: "include",
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }

  getArticles() {
    return fetch(`${this.mainURL}/articles`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }

  createArticle(cardData) {
    return fetch(`${this.mainURL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cardData),
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }

  removeArticle(articleId) {
    return fetch(`${this.mainURL}/articles/${articleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => ErrorHandler.errorThenStatus(res))
      .catch((err) => ErrorHandler.errorCatch(err));
  }
}
