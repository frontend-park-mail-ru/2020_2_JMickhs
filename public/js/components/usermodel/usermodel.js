import EventEmitter from '../../helpers/prototypes/eventemitter'
import Network from '../../helpers/network/network'

export default class UserModel extends EventEmitter {
    constructor() {
        super();
        this.isAuth = false;
        this.id = -1;
        this.login = '';
    }
    cookieUser() {
        Network.checkCookie((status, response) => {
            if (status == 200) {
                alert('по кукам пользователь найден');
                return;
            }
            alert('по кукам пользователь не найден');
        });
    }

    signin(username, password) {
        Network.signin(username, password, (status, response) => {
            if (status == 200) {
                this.isAuth = true;
                this.login = username;
                document.location.href = "#/profile";
                return
            }
            alert(`Пользователь ${username} не вошел`)
            console.log('signin status -', status);
        });
    }
    signup(username, password) {
        Network.signup(username, password, (status, response) => {
            if (status == 200) {
                document.location.href = "#/profile";
                this.isAuth = true;
                this.login = username;
                return
            }
            alert(`Пользователь ${username} не зарегистрировался`)
            console.log('signup status -', status);
        });
    }
}