export let validate = (arg, view) => {
    const loginTable = [
        {
            regExp: new RegExp('^[a-zA-Zа-яА-Я].*$'),
            strErr: 'Логин должен начинаться с буквы'
        },
        {
            regExp: new RegExp('^[a-zA-Zа-яА-я0-9_\.-]*$'),
            strErr: 'Логин может включать только буквы, цифры и символы _ - .'
        },
        {
            regExp: new RegExp('^.{3,15}$'),
            strErr: 'Длинна логина должна быть в пределе от 3 до 15 символов'
        }
    ];

    const passwordTable = [
        {
            regExp: new RegExp('^[a-zA-Z0-9]*$'),
            strErr: 'Пароль может включать только буквы английского алфавита'
        },
        {
            regExp: new RegExp('^.{3,20}$'),
            strErr: 'Длинна пароля должна быть в пределах от 8 до 20 символов'
        }
    ];

    const { login, password } = arg;

    if (login !==  '') {
        for (let i = 0; i < loginTable.length; i++){
            if (!loginTable[i].regExp.exec(login)) {
                view.renderError(loginTable[i].strErr);
                return false;
            }
        }
    }

    if (password !==  '') {
        for (let i = 0; i < passwordTable.length; i++) {
            if (!passwordTable[i].regExp.exec(password)) {
                view.renderError(passwordTable[i].strErr);
                return false;
            }
        }
    }

    return true;
};
