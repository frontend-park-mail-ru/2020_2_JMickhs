class Validator {
    private loginTableСheckup: {regular: RegExp, error: string}[];
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
}

export default new Validator();