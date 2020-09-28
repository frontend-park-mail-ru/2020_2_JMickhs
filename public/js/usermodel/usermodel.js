class UserModel extends EventEmitter {
    constructor() {
        super();
        this.isAuth = false;
        this.id = -1;
        this.login = '';
    }
    cookieUser() {
        ajax(
            'GET',
            'http://89.208.197.127:8080/api/v1/get_current_user',
            null,
            (status, response) => {
                if (status == 200) {
                    alert('по кукам пользователь найден');
                    return;
                }
                alert('по кукам пользователь не найден');
            })
    }

    signin(username, password) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signin', { username, password },
            (status, response) => {
                if (status == 200) {
                    document.location.href = "#/profile";
                    this.isAuth = true;
                    this.login = username;
                    return
                }
                alert(`Пользователь ${username} не вошел`)
                console.log('signin status -', status);
            }
        )
    }
    signup(username, password) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signup', { username, password },
            (status, response) => {
                if (status == 200) {
                    document.location.href = "#/profile";
                    this.isAuth = true;
                    this.login = username;
                    return
                }
                alert(`Пользователь ${username} не зарегистрировался`)
                console.log('signup status -', status);
            }
        )
    }
}