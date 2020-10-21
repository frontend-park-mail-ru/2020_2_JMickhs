class Validator {

    private loginTableСheckup: {regular: RegExp, error: string}[];
    private pswTableСheckup: {regular: RegExp, error: string}[];
    private emailTableСheckup: {regular: RegExp, error: string}[];

    constructor() {
        this.loginTableСheckup = [
            {
                regular: new RegExp('^[a-zA-Zа-яА-я0-9_.-]*$'),
                error: 'Логин может включать только буквы, цифры и символы _ - .',
            },
            {
                regular: new RegExp('^.{3,15}$'),
                error: 'Длинна логина должна быть в пределе от 3 до 15 символов',
            },
        ];

        this.pswTableСheckup = [
            {
                regular: new RegExp('^[a-zA-Z0-9]*$'),
                error: 'Пароль может включать только буквы английского алфавита и цифры',
            },
            {
                regular: new RegExp('^.{5,30}$'),
                error: 'Длинна пароля должна быть в пределах от 5 до 30 символов',
            },
        ];

        this.emailTableСheckup = [
            {
                regular: new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$'),
                error: 'Вы ввели некорректрый email-адрес',
            },
        ];
    }

    validateLogin(login: string) : string[] {
        let result: string[] = [];
        this.loginTableСheckup.forEach((checkup) => {
            if (!checkup.regular.exec(login)) {
                result.push(checkup.error);
            }
        });
        return result;
    }

    validatePsw(psw: string) : string[] {
        let result: string[] = [];
        this.pswTableСheckup.forEach((checkup) => {
            if (!checkup.regular.exec(psw)) {
                result.push(checkup.error);
            }
        });
        return result;
    }
    
    validateEmail(email: string) : string[] {
        let result: string[] = [];
        this.emailTableСheckup.forEach((checkup) => {
            if (!checkup.regular.exec(email)) {
                result.push(checkup.error);
            }
        });
        return result;
    }
}

export default new Validator();