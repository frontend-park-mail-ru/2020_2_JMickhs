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
    signin(username, password) {
        let response = Net.signin(username, password);
        response.then((status) => {
            console.log(status, 'status');
            if (status != 200) {
                return;
            }
            this.isAuth = true;
            this.login = username;
            this.trigger(this.updateEvent)
        });
    }
}