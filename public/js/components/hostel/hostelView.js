import Events from './../../helpers/eventbus/eventbus';
// import Net from '../../helpers/network/network';
var hostelTemplate = require('./hostelTemplate.hbs');

/** Класс представления для страницы отеля */
export default class HostelView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._model = model;

        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
        Events.subscribe('updateHostel', () => {
            this.render();
        });
    }
    /**
     * Отрисовка страницы отеля
     */
    render() {
        const urlImg = Net.getUrlFile(this._model.image);
        this.page.innerHTML = hostelTemplate(this._model);
    }
}