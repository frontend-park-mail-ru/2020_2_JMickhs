import Events from '../eventbus/eventbus';

/** Класс валидации данных */
class Validation {
    /** Конструктор класса */
    constructor() {
        this._loginTable = [
            {
                regExp: new RegExp('^[a-zA-Zа-яА-я0-9_.-]*$'),
                strErr: 'Логин может включать только буквы, цифры и символы _ - .',
            },
            {
                regExp: new RegExp('^.{3,15}$'),
                strErr: 'Длинна логина должна быть в пределе от 3 до 15 символов',
            },
        ];

        this._passwordTable = [
            {
                regExp: new RegExp('^[a-zA-Z0-9]*$'),
                strErr: 'Пароль может включать только буквы английского алфавита и цифры',
            },
            {
                regExp: new RegExp('^.{5,30}$'),
                strErr: 'Длинна пароля должна быть в пределах от 5 до 30 символов',
            },
        ];

        this._emailTable = [
            {
                regExp: new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$'),
                strErr: 'Вы ввели некорректрый email-адрес',
            },
        ];
    }
    /**
     * Валидация для пароля и/или логина
     * @param {string} login - логин
     * @param {string} evtErrLogin - тип события, которое нужно стригеррить при ошибке в логине
     * @return {boolean} true, если ошибок не обнаружено
     */
    validateLogin(login, evtErrLogin) {
        for (let i = 0; i < this._loginTable.length; i++) {
            if (!this._loginTable[i].regExp.exec(login)) {
                Events.trigger(evtErrLogin, this._loginTable[i].strErr);
                return false;
            }
        }
        return true;
    }
    /**
     * Валидация для пароля и/или логина
     * @param {string} password - пароль
     * @param {string} evtErrPsw - тип события, которое нужно стригеррить при ошибке в пароле
     * @return {boolean} true, если ошибок не обнаружено
     */
    validatePassword(password, evtErrPsw) {
        for (let i = 0; i < this._passwordTable.length; i++) {
            if (!this._passwordTable[i].regExp.exec(password)) {
                Events.trigger(evtErrPsw, this._passwordTable[i].strErr);
                return false;
            }
        }
        return true;
    }
    /**
     * Валидация для пароля и/или логина
     * @param {string} email - email
     * @param {string} evtErrEmail - тип события, которое нужно стригеррить при ошибке в пароле
     * @return {boolean} true, если ошибок не обнаружено
     */
    validateEmail(email, evtErrEmail) {
        for (let i = 0; i < this._emailTable.length; i++) {
            if (!this._emailTable[i].regExp.exec(email)) {
                Events.trigger(evtErrEmail, this._emailTable[i].strErr);
                return false;
            }
        }
        return true;
    }
}

export default new Validation();
