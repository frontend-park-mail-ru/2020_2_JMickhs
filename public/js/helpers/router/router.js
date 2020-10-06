
/** Заглушка для страницы ошибки */
const ErrorPage = {
  activate: () => {
    document.getElementById('page').innerHTML = `
        <p class="text-first">Уупс, произошла ошибка!</p>
        <p class="text">Такой страницы не существует</p>
      `;
  },
};

/** Роутер, определяющий контроллер страницы */
export default class Router {
  /**
     * Создает экземпляр
     */
  constructor() {
    this.routes = [];
  }
  /**
     * Добавляет контроллер и путь, по которому он должен срабатывать
     * @param {string} path - путь для контроллера
     * @param {any} controller - контроллер, обязан иметь метод activate
     */
  append(path, controller) {
    this.routes[this.routes.length] = {path: path, controller: controller};
  }
  /**
     * Стартует роутер
     */
  start() {
    window.addEventListener('popstate', this._route.bind(this));
    window.addEventListener('load', this._route.bind(this));
    window.addEventListener('click', (evt) => {
      const {target} = evt;
      this._checkAnchor(target, evt, 4);
    });
  }
  /**
     * Проверяет, является ли елемент <a>, причем рекурсивно
     * @param {HTMLElement} target - проверяемый элемент
     * @param {Event} evt - евент, к которому примениться preventDefault в случае нахождения
     * @param {number} n - максимальная глубина рекурсии
     */
  _checkAnchor(target, evt, n) {
    if (target instanceof HTMLAnchorElement) {
      evt.preventDefault();
      this.pushState(target.href);
      return;
    }
    if (target === window || n === 0) {
      return;
    }
    n = n - 1;
    this._checkAnchor(target, evt, n);
  }
  /**
     * изменяет url
     * @param {string} url - новый url
     * @param {Object} state - объект состояния
     */
  pushState(url = '/', state = {}) {
    if (url !== location.pathname) {
      history.pushState(state, document.title, url);
    } else {
      history.replaceState(state, document.title, url);
    }
    this._route();
  }
  /**
     * ищет контроллер по путю
     * @param {string} path - ключ, по которому ищется контроллер
     */
  _findComponentByPath(path) {
    return this.routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm')));
    // gm - это многострочный текст парни (вроде как)
  }
  /**
     * переключает контроллер при вызове на нужный
     * @param {Event} evt - евент
     */
  _route(evt = null) {
    if (evt !== null) {
      evt.preventDefault();
    }
    const path = '/' + location.pathname.split('/')[1];
    const arg = location.pathname.split('/')[2];
    const {controller} = this._findComponentByPath(path) || {controller: ErrorPage};
    controller.activate(arg);
  }
}
