import ListModel from './listModel';
import ListView from './listView';

/** Class representing a controller for listHotel */
export default class ListController {
    /**
     * Initialize intance with model and view 
     * @param {*} parent - parent  
     */
    constructor(parent) {
        this._model = new ListModel();
        this._view = new ListView(parent, this._model);
    }
    /**
     * Set the model data from net
     */
    activate() {
        this._model.getInfo();
    }
}