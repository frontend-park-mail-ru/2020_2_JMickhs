import HostelModel from './hostelModel';
import HostelView from './hostelView';

export default class HotelController {
    constructor(parent) {
        this._model = new HostelModel();
        this._view = new HostelView(parent, this._model);
    }
    activate(id) {
        if (id === undefined || !Number.isInteger(+id)) {
            router.pushState('/error');
            return;
        }
        this._model.fillModel(id);
    }
}