import Net from '../../helpers/network/network';

export default class HostelView {
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
        EventBus.subscribe('updateHostel', () => {
            this.render();
        });
    }
    render() {
        let urlImg = Net.getUrlImage(this._model.image);
        this.page.innerHTML = `
        <div class="card">
        <img class="avatar" src="${urlImg}" alt="Avatar">
            <h3>
                <b>${this._model.name}</b>
            </h3>
            <h3>
                <b>${this._model.description}</b>
            </h3>
        </div>
        `;
    }
}