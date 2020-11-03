class Validator {
    private loginTableCheckup: {regular: RegExp, error: string}[];
    private passwordTableCheckup: {regular: RegExp, error: string}[];
    private emailTableCheckup: {regular: RegExp, error: string}[];

    constructor() {
        this.loginTableCheckup = [
            {
                regular: new RegExp('^[a-zA-Zа-яА-я0-9_.-]*$'),
                error: 'Логин может включать только буквы, цифры и символы _ - .',
            },
            {
                regular: new RegExp('^.{3,15}$'),
                error: 'Длина логина должна быть в пределе от 3 до 15 символов',
            },
        ];

        this.passwordTableCheckup = [
            {
                regular: new RegExp('^[a-zA-Z0-9]*$'),
                error: 'Пароль может включать только буквы английского алфавита и цифры',
            },
            {
                regular: new RegExp('^.{5,30}$'),
                error: 'Длина пароля должна быть в пределах от 5 до 30 символов',
            },
        ];

        this.emailTableCheckup = [
            {
                regular: new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$'),
                error: 'Вы ввели некорректный email-адрес',
            },
        ];
    }

    validateLogin(login: string) : string[] {
        const result: string[] = [];
        this.loginTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(login)) {
                result.push(checkup.error);
            }
        });
        return result;
    }

    validatePassword(psw: string) : string[] {
        const result: string[] = [];
        this.passwordTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(psw)) {
                result.push(checkup.error);
            }
        });
        return result;
    }

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
