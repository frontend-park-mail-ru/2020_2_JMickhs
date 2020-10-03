import Net from '../../helpers/network/network'

export default class ListModel {
    constructor() {
        this.haveInfo = false;
        this.hostels = [];
    }
    getInfo() {
        let response = Net.getHotels();
        response.then(result => {
            if (result.status == 200) {
                this.haveInfo = true;
                this.hostels = result.body;
                EventBus.trigger('loadHostels')
            }
        })
    }
}