import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import Validation from '../../helpers/validation/validation';
import {
    UPDATE_PASSWORD,
    PROFILE_RENDER_ERROR,
    SIGNOUT,
    REDIRECT,
    NAVBAR_ACTIVE,
    HAVNT_USER,
    PROFILE_USER,
} from '../../helpers/eventbus-const/constants';

/** Класс контроллера для страницы профиля */
export default class ProfileController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = ProfileModel.instance;
        this._view = new ProfileView(parent, this._model);

        Events.subscribe(UPDATE_PASSWORD, (arg) => {
            if (arg.oldPassword === '' || arg.newPassword === '') {
                this._view.renderMessage('Заполните все поля');
            } else if (arg.oldPassword === arg.newPassword) {
                this._view.renderMessage('Вы ввели одинаковые пароли');
            } else if (
                Validation.validatePassword(arg.newPassword, PROFILE_RENDER_ERROR)
            ) {
                this._model.updatePassword(arg.oldPassword, arg.newPassword);
            }
        });

        Events.subscribe(SIGNOUT, () => {
            Events.trigger(REDIRECT, {url: '/signin'});
        });
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        Events.subscribe(HAVNT_USER, () => {
            Events.trigger(REDIRECT, {url: '/signin'});
        });
        Events.subscribe(PROFILE_USER, () => {
            this._view.render();
        });
    }
}
