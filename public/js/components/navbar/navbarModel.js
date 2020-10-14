import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    UPDATE_USER,
    UPDATE_NAVBAR,
    PAGE_SIGNUP,
    PAGE_SIGNIN,
} from '../../helpers/eventbus/constants';

/** Класс модели для навбара */
export default class NavbarModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.el1 = {text: 'HostelScan', ref: '/'};
        this.el2 = {text: 'Список отелей', ref: '/list'};
        this.el3 = {text: 'Авторизация', ref: '/signin'};

        this._user = ProfileModel;

        Events.subscribe(UPDATE_USER, () => {
            if (this._user.isAuth) {
                this.el3 = {text: this._user.login, ref: '/profile'};
                Events.trigger(UPDATE_NAVBAR);
            }
        });
        Events.subscribe(PAGE_SIGNUP, () => {
            this.el3 = {text: 'Регистрация', ref: '/signup'};
            Events.trigger(UPDATE_NAVBAR);
        });
        Events.subscribe(PAGE_SIGNIN, () => {
            this.el3 = {text: 'Авторизация', ref: '/signin'};
            Events.trigger(UPDATE_NAVBAR);
        });
    }
}
