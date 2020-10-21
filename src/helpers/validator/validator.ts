/** Класс, занимающийся валидацией данных */
class Validator {
    private loginTableCheckup: {regular: RegExp, error: string}[];
    private pswTableCheckup: {regular: RegExp, error: string}[];
    private emailTableCheckup: {regular: RegExp, error: string}[];
    /** Создает экземпляр класса */
    constructor() {
        this.loginTableCheckup = [
            {
                regular: new RegExp('^[a-zA-Zа-яА-я0-9_.-]*$'),
                error: 'Логин может включать только буквы, цифры и символы _ - .',
            },
            {
                regular: new RegExp('^.{3,15}$'),
                error: 'Длинна логина должна быть в пределе от 3 до 15 символов',
            },
        ];

        this.pswTableCheckup = [
            {
                regular: new RegExp('^[a-zA-Z0-9]*$'),
                error: 'Пароль может включать только буквы английского алфавита и цифры',
            },
            {
                regular: new RegExp('^.{5,30}$'),
                error: 'Длинна пароля должна быть в пределах от 5 до 30 символов',
            },
        ];

        this.emailTableCheckup = [
            {
                regular: new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$'),
                error: 'Вы ввели некорректрый email-адрес',
            },
        ];
    }
    /**
     * Валидация имени пользователя
     * @param {string} login - иям пользователя
     * @return {string[]} - массив строк с ошибками. Если ошибок 0 - массив пустой
     */
    validateLogin(login: string) : string[] {
        const result: string[] = [];
        this.loginTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(login)) {
                result.push(checkup.error);
            }
        });
        return result;
    }
    /**
     * Валидация пароля
     * @param {string} psw - пароль
     * @return {string[]} - массив строк с ошибками. Если ошибок 0 - массив пустой
     */
    validatePsw(psw: string) : string[] {
        const result: string[] = [];
        this.pswTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(psw)) {
                result.push(checkup.error);
            }
        });
        return result;
    }
    /**
     * Валидация почты
     * @param {string} email - почта
     * @return {string[]} - массив строк с ошибками. Если ошибок 0 - массив пустой
     */
    validateEmail(email: string) : string[] {
        const result: string[] = [];
        this.emailTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(email)) {
                result.push(checkup.error);
            }
        });
        return result;
    }
}

export default new Validator();
