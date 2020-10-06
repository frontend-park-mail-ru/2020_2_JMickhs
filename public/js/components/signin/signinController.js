import SigninModel from './signinModel';
import SigninView from './signinView';
import Events from './../../helpers/eventbus/eventbus';
import {validate} from '../../helpers/validation/validation';

/** Класс контроллера для страницы авторизации */
export default class SigninController {
    /**
     * Инициализация класса
     * @param {*} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);

        Events.subscribe('submitSignin', (arg) => {
            if (arg.login === '' || arg.password === '') {
                this._view.renderError('Заполните все поля');
                return;
            }
            if (validate(arg, 'authRenderError')) {
                this._model.signin(arg.login, arg.password);
            }
        });
    }
    /**
     * Отрисовка страницы авторизации и дальнейшего роутинга
     */
    activate() {
        if (this._model.isAuth()) {
            Events.trigger('redirect', {url: '/profile'});
            return;
        }
        this._view.render();
        Events.trigger('pageSignin');
    }
}
