export default class BaseComponent {
  constructor() {
    this._listeners = [];
  }

  _addListener(element, event, callback) {
    this.element = element;
    element.addEventListener(event, callback);
  }

  _setListeners(listeners) {
    listeners.forEach((listener) => {
      this._addListener(...listener);
    });
  }

  _removeListeners() {
    this._listeners.forEach((listener) => {
      const { element, event, callback } = listener;
      element.removeEventListener(event, callback);
    });
  }
}
