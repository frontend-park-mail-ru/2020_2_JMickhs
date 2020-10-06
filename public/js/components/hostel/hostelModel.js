import Net from '../../helpers/network/network';

export default class HostelModel {
    constructor() {
        this.id = -1;
        this.description = '';
        this.image = '';
        this.name = '';
    }
    fillModel(id) {
        let response = Net.getHostel(id);
        response.then(response => {
            if (response.status !== 200) {
                EventBus.trigger('errorHostel');
                return;
            }
            const body = response.body;
            this.description = body.description;
            this.id = body.id;
            this.name = body.name;
            this.image = body.image;
            EventBus.trigger('updateHostel');
        });
    }
}