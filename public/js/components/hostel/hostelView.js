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
        const urlImg = Net.getUrlFile(this._model.image);
        this.page.innerHTML = `
        <div class="hotel-card">
        <img class="avatar" src="${urlImg}" alt="Avatar">
            <h3>
                <p class="hotel-card-title">${this._model.name}</p>
            </h3>
            <h3>
                <p class="hotel-card-text">${this._model.description}</p>
            </h3>
        </div>
        `;
    }
}