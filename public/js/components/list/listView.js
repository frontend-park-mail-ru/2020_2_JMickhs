import ListModel from './listModel';
import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';

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
    /**
     * Отрисовка страницы списка отелей
     */
    render() {
        let strRes = '';
        this._model.hostels.forEach((hostel) => {
            const id = hostel.id;
            const urlImage = Net.getUrlFile(hostel.image);
            const tmp = `
            <div class="card">
                 <img class="avatar" src="${urlImage}" alt="Avatar">
                 <h3>
                 <p class="hotel-card-title">${hostel.name}</p>
                 </h3>
                  <p class="hotel-card-block">
                    <a class="btn-green" href="/hostel/${id}">Подробнее</a>
                  </p>      
             </div>
         `;
            strRes += tmp;
        });
        this.page.innerHTML = strRes;
    }
}
