
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
class RouterCustom {
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
      let {target} = evt;
      while (target.parentNode) {
        if (target instanceof HTMLAnchorElement) {
          evt.preventDefault();
          this.pushState(target.href);
          return;
        }
        target = target.parentNode;
      }
    });
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
      * @return {any} Возвращает контроллер
     */
  _findComponentByPath(path) {
    return this.routes.find(
        (r) => r.path.match(new RegExp(`^\\${path}$`, 'gm')),
    );
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

const Router = new RouterCustom;
export default Router;
