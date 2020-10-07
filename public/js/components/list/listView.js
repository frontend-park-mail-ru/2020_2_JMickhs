import ListModel from './listModel';
import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';

var myTemplate = require('./listTemplate.hbs');

/** Класс представления для страницы списка отелей */
export default class ListView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof ListModel) {
            this._parent = parent;
            this._model = model;
        }

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
        }
        this._parent.appendChild(page);
        this.page = page;

        Events.subscribe('loadHostels', () => {
            this.render();
        });
    }
    // render() {
    //     let strRes = '';

    //     this._model.hostels.forEach((hostel) => {
    //         const id = hostel.id;
    //         const urlImage = Net.getUrlFile(hostel.image);
    //         const tmp = `
    //         <div class="card">
    //              <img class="avatar" src="${urlImage}" alt="Avatar">
    //              <h3>
    //                 <p class="hotel-card-title" href="/hostel/${id}">${hostel.name}
    //                 </p>
    //              </h3>
    //               <p class="hotel-card-block">
    //                 <a class="btn-green" href="/hostel/${id}">Подробнее</a>
    //               </p>
    //          </div>
    //      `;
    //         strRes += tmp;
    //     });
    //     this.page.innerHTML = strRes;
    // }

    /**
     * Отрисовка страницы списка отелей
     */
    render() {
        // console.log("fwefwefwefwefef")
        // console.log(this._model.hostels);
        // this.page.innerHTML.appendChild
        console.log("hotels : ")
        console.log(this._model.hostels)
        const urlImg = Net.getUrlFile(this._model.image);
        this.page.innerHTML = myTemplate(this._model.hostels);
    }
}
