import Net from '../../helpers/network/network';
import Events from './../../helpers/eventbus/eventbus';

export default class ListModel {
    constructor() {
        this.haveInfo = false;
        this.hostels = [];
    }
    getInfo() {
        const response = Net.getHotels();
        response.then((result) => {
            if (result.status == 200) {
                this.haveInfo = true;
                this.hostels = result.body;
                Events.trigger('loadHostels');
            }
        });
    }
}
