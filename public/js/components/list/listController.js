import ListModel from './listModel';
import ListView from './listView';

export default class ListController {
    constructor(parent) {
        this._model = new ListModel();
        this._view = new ListView(parent, this._model);
    }
    activate() {
        this._model.getInfo();
    }
}