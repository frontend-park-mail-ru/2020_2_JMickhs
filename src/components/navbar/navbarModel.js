import ProfileModel from '@profile/profileModel';

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
    }
}
