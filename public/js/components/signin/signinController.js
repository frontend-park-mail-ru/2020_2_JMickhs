import SigninModel from './signinModel';
import SigninView from './signinView';
import Events from './../../helpers/eventbus/eventbus';
import {validate} from '../../helpers/validation/validation';

/** Класс контроллера для страницы авторизации */
export default class SigninController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);

        Events.subscribe('submitSignin', (arg) => {
            if (arg.login === '' || arg.password === '') {
                if (arg.login === '') {
                    Events.trigger('errLoginSignin', 'Заполните все поля');
                }
                if (arg.password === '') {
                    Events.trigger('errPasswordSignin', 'Заполните все поля');
                }
                return;
            }
            if (validate(arg, 'errLoginSignin', 'errPasswordSignin')) {
                this._model.signin(arg.login, arg.password);
            }
        });
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger('pageSignin');
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
        // TODO:
    }
}
