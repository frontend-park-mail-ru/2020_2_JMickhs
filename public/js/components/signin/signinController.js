import SigninModel from './signinModel';
import SigninView from './signinView';
import Events from './../../helpers/eventbus/eventbus';
import Validation from '../../helpers/validation/validation';
import {
    REDIRECT,
    NAVBAR_ACTIVE,
    SUBMIT_SIGNIN,
    ERR_LOGIN_SINGIN,
    ERR_PASSWORD_SINGIN,
    PAGE_SIGNIN,
} from '../../helpers/eventbus-const/constants';

/** Класс контроллера для страницы авторизации */
export default class SigninController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);

        Events.subscribe(SUBMIT_SIGNIN, (arg) => {
            if (arg.login === '' || arg.password === '') {
                if (arg.login === '') {
                    Events.trigger(ERR_LOGIN_SINGIN, 'Заполните все поля');
                }
                if (arg.password === '') {
                    Events.trigger(ERR_PASSWORD_SINGIN, 'Заполните все поля');
                }
                return;
            }
            if (
                Validation.validateLogin(arg.login, ERR_LOGIN_SINGIN) &&
                Validation.validatePassword(arg.password, ERR_PASSWORD_SINGIN)
            ) {
                this._model.signin(arg.login, arg.password);
            }
        });
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger(PAGE_SIGNIN);
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth()) {
            Events.trigger(REDIRECT, {url: '/profile'});
            return;
        }
        this._view.render();
    }
}
