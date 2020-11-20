// Подходит Сережа к директору своей школы и спрашивает:
// - Эльвира Леопольдовна, а что такое нюанс?
// - Ну давай, Сережка, объясню. Ты вот хорошо ЕГЭ написал?
// - Неет
// - Дааа уж... Но у меня для тебя хорошая новость. Ты поступил в Бауманку
// - Ураааа! Я всегда об этом мечтал!
// - Но есть один нюанс...

interface Input {
    name: string,
    value: string,
}

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
                regular: new RegExp('^.{5,25}$'),
                error: 'Длина пароля должна быть в пределах от 5 до 25 символов',
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

    loginRules(): string[] {
        const rules: string[] = [];
        this.loginTableCheckup.forEach((rule) => {
            rules.push(rule.error);
        });
        return rules;
    }

    validatePassword(password: string) : string[] {
        const result: string[] = [];
        this.passwordTableCheckup.forEach((checkup) => {
            if (!checkup.regular.exec(password)) {
                result.push(checkup.error);
            }
        });
        return result;
    }

    passwordRules(): string[] {
        const rules: string[] = [];
        this.passwordTableCheckup.forEach((rule) => {
            rules.push(rule.error);
        });
        return rules;
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

    isStringsEqual(left: string, right: string): boolean {
        return left === right;
    }

    stringsEmpty(strs: Input[]): string[] {
        const result: string[] = [];
        strs.forEach((input) => {
            if (input.value === '') {
                result.push(input.name);
            }
        });
        return result;
    }
}

export default new Validator();
