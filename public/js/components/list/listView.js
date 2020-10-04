import ListModel from './listModel';

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
            let tmp = `
            <div class="card">
                 <img class="avatar" src="https://aviasovet.ru/blog/wp-content/uploads/2013/05/hayman-island-resort.jpg" alt="Avatar">
                 <div class="container">
                 <div class="cnt">
                     <h3>
                         <b>${hostel.Name}</b>
                     </h3>
                     <h3>
                         <b>тел.: 8(283)293-92-00</b>
                     </h3>
                 </div>
                 <button class="btn">Подробнее</button>
                 </div>
             </div>
         `;
            strRes += tmp;
        });
        this.page.innerHTML = strRes;
    }
}