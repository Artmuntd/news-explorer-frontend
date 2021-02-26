export default class ErrorHandler {
  static errorCatch(err) {
    return Promise.reject(err);
  }

  static errorThen(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }

  static errorThenStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }
}
