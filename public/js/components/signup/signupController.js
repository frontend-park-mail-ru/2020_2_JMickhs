import SignupModel from './signupModel';
import SignupView from './signupView';
import Events from './../../helpers/eventbus/eventbus';
import {validate} from '../../helpers/validation/validation';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
        Events.subscribe('submitSignup', (arg) => {
            const pass1 = arg.password1;
            const pass2 = arg.password2;
            const login = arg.login;
            this.validate(login, pass1, pass2);
        });
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger('pageSignup');
        Events.trigger('navbarActive', 3);
        if (this._model.isAuth()) {
            Events.trigger('redirect', {url: '/profile'});
            return;
        }
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.unsubscribeEvents();
    }

    /**
     * Валидация формы
     * @param {string} login - родительский элемент html-страницы
     * @param {string} pass1 - родительский элемент html-страницы
     * @param {string} pass2 - родительский элемент html-страницы
     */
    validate(login, pass1, pass2) {
        if (login === '' || pass1 === '' || pass2 === '') {
            if (login === '') {
                Events.trigger('errLoginSignup', 'Заполните все поля');
            }
            if (pass1 === '') {
                Events.trigger('errPassword1Signup', 'Заполните все поля');
            }
            if (pass2 === '') {
                Events.trigger('errPassword2Signup', 'Заполните все поля');
            }
            return;
        } else if (pass1 !== pass2) {
            Events.trigger('errPassword1Signup', 'Пароли не совпадают');
            Events.trigger('errPassword2Signup', 'Пароли не совпадают');
        } else if (validate({login: login, password: pass1}, 'errLoginSignup', 'errPasswordSignup')) {
            this._model.signup(login, pass1);
        }
    }
}
