import EvenEmitter from '../../helpers/prototypes/eventemitter'
import Net from '../../helpers/network/network'

export class ListController {
    constructor(view, model) {
        if (view instanceof ListView && model instanceof ListModel) {
            this._view = view;
            this._model = model;
        }
    }
    activate() {
        this._model.getInfo();
    }
}

export class ListView extends EvenEmitter {
    constructor(parent, model) {
        super();
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

        this._model.subscribe(this._model.updateEvent, () => {
            this.render();
        })


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

export class ListModel extends EvenEmitter {
    constructor() {
        super();
        this.haveInfo = false;
        this.updateEvent = 'update';
        this.hostels = [];
    }
    getInfo() {
        let response = Net.getHotels();
        response.then(result => {
            if (result.status == 200) {
                this.haveInfo = true;
                this.hostels = result.body;
                this.trigger(this.updateEvent)
            }
        })
    }
}
