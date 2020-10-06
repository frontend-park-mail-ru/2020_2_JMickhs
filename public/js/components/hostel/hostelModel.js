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
            this.description = body.Description;
            this.id = body.ID;
            this.name = body.Name;
            this.image = body.Image;
            EventBus.trigger('updateHostel');
        });
    }
}