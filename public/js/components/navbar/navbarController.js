import Events from '../../helpers/eventbus/eventbus';
import NavbarModel from './navbarModel';
import NavbarView from './navbarView';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';

/** Класс контроллера для навбара */
export default class NavbarController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new NavbarModel();
        if (parent instanceof HTMLElement) {
            this._view = new NavbarView(parent, this._model);
        }
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.render();
        Events.subscribe(NAVBAR_ACTIVE, (arg) => {
            document.getElementById('nav1').className = '';
            document.getElementById('nav2').className = '';
            document.getElementById('nav3').className = '';
            const tmp = document.getElementById(`nav${arg}`);
            if (tmp !== null) {
                tmp.className = 'current';
            }
        });
    }
}
