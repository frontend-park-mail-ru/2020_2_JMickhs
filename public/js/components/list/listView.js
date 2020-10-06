import ListModel from './listModel';
import Net from '../../helpers/network/network';

export default class ListView {
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

        EventBus.subscribe('loadHostels', () => {
            this.render();
        });
    }
    render() {
        let strRes = '';
        this._model.hostels.forEach((hostel) => {
            const id = hostel.id;
            let urlImage = Net.getUrlFile(hostel.image);
            let tmp = `
            <div class="card">
                 <img class="avatar" src="${urlImage}" alt="Avatar">
                 <div class="container">
                 <div class="cnt">
                     <h3>
                         <b>${hostel.name}</b>
                     </h3>
                     <h3>
                         <b>Тип: Отель</b>
                     </h3>
                 </div>
                 <a class="btn-green" href="/hostel/${id}">Подробнее</a>
                 </div>
             </div>
         `;
            strRes += tmp;
        });
        this.page.innerHTML = strRes;
    }
}