import HostelModel from './hostelModel';
import HostelView from './hostelView';
import Events from './../../helpers/eventbus/eventbus';

export default class HotelController {
    constructor(parent) {
        this._model = new HostelModel();
        this._view = new HostelView(parent, this._model);
    }
    activate(id) {
        if (id === undefined || !Number.isInteger(+id)) {
            Events.trigger('redirect', {url: '/error'});
            return;
        }
        this._model.fillModel(id);
    }
}
