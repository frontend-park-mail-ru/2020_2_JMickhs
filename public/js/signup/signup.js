class UserModel extends EventEmitter {

}

class SignUpView extends EventEmitter {
    constructor() {
        this.app = document.getElementById('app');
    }
    render() {

    }

}

class SignUpController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

}

function createSignUpContorller() {

}