import EvenEmitter from '../../helpers/prototypes/eventemitter'
import UserModel from '../usermodel/usermodel'

export class NavbarController {
    constructor(view, model) {
        if (view instanceof NavbarView && model instanceof NavbarModel) {
            this._view = view;
            this._model = model;
        }
    }
    activate() {
        this._view.show();
    }
}

export class NavbarView extends EvenEmitter {
    constructor(parent, model) {
        super();
        if (parent instanceof HTMLElement && model instanceof NavbarModel) {
            this._parent = parent;
            this._model = model;
        }

        this._model.subscribe(this._model.updateNavEvent, this.show.bind(this));

        let nav = document.getElementById('navbar');
        if (nav == null) {
            nav = document.createElement('div');
            nav.id = 'navbar';
            this._parent.appendChild(nav);
        }
        this.navbar = nav;
    }
    show() {
        console.log(this.navbar.innerHTML);
        this.navbar.innerHTML = `
        <ul class="menu-main">
        <li>
            <a href="${this._model.el1.ref}">${this._model.el1.text}</a>
        </li>
        <li>
            <a href="${this._model.el2.ref}">${this._model.el2.text}</a>
        </li>
        <li>
            <a href="${this._model.el3.ref}">${this._model.el3.text}</a>    
        </li>
        </ul>
        `;
    }
}

export class NavbarModel extends EvenEmitter {
    constructor(userModel) {
        super();
        this.el1 = { text: 'HostelScan', ref: '#/' };
        this.el2 = { text: 'Список отелей', ref: '#/list' };
        this.el3 = { text: 'Авторизация', ref: '#/signin' };

        this.updateNavEvent = 'updatenav';

        if (userModel instanceof UserModel) {
            this._user = userModel;
        }
        this._user.subscribe(this._user.updateEvent, () => {
            if (this._user.isAuth) {
                this.el3 = { text: 'Профиль', ref: '#/profile' };
                this.trigger(this.updateNavEvent);
            }
        });
    }
}

