import Net from '../../helpers/network/network';

/** Класс модели пользователя */
class UserModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.login = '';
        this.id = -1;
        this.isAuth = false;
        this.avatar = '';
        this.timerId = -1;
    }
    /**
     * Запросить с сервера информацию о пользователе
     */
    getCurrUser() {
        const response = Net.getCurrUser();
        response.then((response) => {
            const status = response.status;
            const body = response.body;
            if (status === 200) {
                this.isAuth = true;
                this.login = body.username;
                this.id = body.id;
                this.avatar = body.avatar;
                EventBus.trigger('updateUser');
                EventBus.trigger('profileUser');
            } else {
                EventBus.trigger('haventUser');
            }
        });
    }
    /**
     * Обновить аватар(и все сведения о пользователе)
     */
    updateAvatar() {
        const response = Net.getCurrUser();
        response.then((response) => {
            const status = response.status;
            const body = response.body;
            if (status === 200) {
                this.isAuth = true;
                this.login = body.username;
                this.id = body.id;
                this.avatar = body.avatar;
                EventBus.trigger('updateAvatar');
            }
        });
    }
    /**
     * Авторизация пользователя
     * @param {string} username - логин пользователя
     * @param {string} password - пароль пользователя
     */
    signin(username, password) {
        const response = Net.signin(username, password);
        response.then((response) => {
            const status = response.status;
            const body = response.body;
            if (status === 200) {
                this.id = body.id;
                this.avatar = body.avatar;
                this.isAuth = true;
                this.login = username;
                EventBus.trigger('updateUser');
                EventBus.trigger('signinUser');
            } else if (status === 401) {
                EventBus.trigger('errorSignin', 'Вы ввели неправильный логин или пароль');
            } else {
                EventBus.trigger('errorSignin', `Ошибка сервера: статус - ${status}`);
            }
        }).catch(err => {
            EventBus.trigger('errorSignin');
        });
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин пользователя
     * @param {string} password - пароль пользователя
     */
    signup(username, password) {
        const response = Net.signup(username, password);
        response.then((response) => {
            const status = response.status;
            const body = response.body;
            if (status === 200) {
                this.id = body.id;
                this.avatar = body.avatar;
                this.isAuth = true;
                this.login = username;
                EventBus.trigger('updateUser');
                EventBus.trigger('signupUser');
            } else if(status === 500) {
                EventBus.trigger('errorSignup', 'Пользователь с таким логином уже существует!');
            } else {
                EventBus.trigger('errorSignup', `Ошибка сервера: статус ${status}`);
            }
        }).catch(err => {
            EventBus.trigger('errorSignup', err);
        });
    }
    /**
     * Деавторизация пользователя
     */
    signout() {
        const response = Net.signout();
        response.then((status) => {
            if (status === 200) {
                this.id = -1;
                this.username = '';
                this.isAuth = false;
                this.avatar = '';
                EventBus.trigger('signout');
            }
        });
    }
    /**
     * Смена пароля
     * @param {string} oldPassword - старый пароль
     * @param {string} password - новый пароль
     */
    updatePassword(oldPassword, password) {
        const response = Net.updatePassword(oldPassword, password);
        response.then((status) => {
            if (status === 409) {
                EventBus.trigger('passwordUpdateError', 'Вы ввели неверный пароль');
            } else {
                EventBus.trigger('getNewPassword');
            }
        });
    }
}

/** Класс модели для страницы профиля */
export default class ProfileModel {
    /**
     * Создание singleton-объекта модели пользователя
     */
    static get instance() {
        return this._instance || (this._instance = new UserModel());
    }
}