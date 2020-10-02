import EvenEmitter from '../../helpers/prototypes/eventemitter'
import Net from '../../helpers/network/network'

export default class UserModel extends EvenEmitter {
    constructor() {
        super();
        this.login = ''
        this.id = -1;
        this.isAuth = false;

        this.updateEvent = 'updateEvent';
    }
    cookieUser() {
        let response = Net.getCurrUser();
        response.then((response) => {
            let status = response.status;
            let body = response.body; // TODO:
            if (status == 200) {
                this.isAuth = true;
                this.trigger(this.updateEvent);
            }
        });
        // response.catch((status, err) => {
        //     alert('ошибка работа с куками', status, err);
        // });
    }
    signin(username, password) {
        let response = Net.signin(username, password);
        response.then((status) => {
            if (status != 200) {
                this.trigger(this.updateEvent)
                return;
            }
            this.isAuth = true;
            this.login = username;
            this.trigger(this.updateEvent)
        });
    }
    signup(username, password) {
        let response = Net.signup(username, password);
        response.then((status) => {
            if (status != 200) {
                this.trigger(this.updateEvent)
                return;
            }
            this.isAuth = true;
            this.login = username;
            this.trigger(this.updateEvent)
        });
    }

}