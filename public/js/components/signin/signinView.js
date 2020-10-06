import SigninModel from './signinModel';
import Events from './../../helpers/eventbus/eventbus';

/** Класс представления для страницы авторизации */
export default class SigninView {
  /**
     * Инициализация класса
     * @param {*} parent - родительский элемент html-страницы
     * @param {*} model - модель
     */
  constructor(parent, model) {
    if (parent instanceof HTMLElement && model instanceof SigninModel) {
      this._parent = parent;
      this._model = model;
    }
    Events.subscribe('errorSignin', (arg) => {
      this.renderError(arg);
    });

    let page = document.getElementById('page');
    if (page === null) {
      page = document.createElement('div');
      page.id = 'page';
      this._parent.appendChild(page);
    }
    this.page = page;

    Events.subscribe('authRenderError', (arg) => {
      this.renderError(arg);
    });
  }
  /**
     * Отрисовка страницы авторизации
     */
  render() {
    this.page.innerHTML = `
        <div class="container"></div>
        <form action="" class="ui-form" id="signinform">
            <h2>Вход в аккаунт</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <div class="form-row"">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <p class="hotel-card-text">Нет аккаунта? 
                <a href="/signup" class="refer">Регистрация</a>
            </p>
            <div class="form-row"">
                <button class="btn-green" type="submit" id="btnsignin">Вход</button>
            </div>
        </form>
        </div>
        `;

    const form = document.getElementById('signinform');
    const loginInput = document.getElementById('login');
    const passInput = document.getElementById('password');

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const login = loginInput.value;
      const password = passInput.value;
      Events.trigger('submitSignin', {login: login, password: password});
    });
  }
  /**
     * Отрисовка сообщения об ошибке
     */
    renderError(errstr = '') {
        const form = document.getElementById('signinform');
        let errLine;

        if (this._model.timerId !== -1) {
            clearTimeout(this._model.timerId);
            errLine = document.getElementById('error-line');
            errLine.innerHTML = `<h3>${errstr}</h3>`;
        } else {
            errLine = document.createElement('div');
            errLine.setAttribute('class', 'error');
            errLine.setAttribute('id', 'error-line');
            errLine.innerHTML = `<h3>${errstr}</h3>`;
            form.appendChild(errLine);
        }

        this._model.timerId = setTimeout(() => {
            form.removeChild(errLine);
            this._model.timerId = -1;
        },5000);
    }
}