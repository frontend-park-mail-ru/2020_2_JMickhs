import Net from '../../helpers/network/network';
import Events from './../../helpers/eventbus/eventbus';

export default class HostelModel {
    constructor() {
        this.id = -1;
        this.description = '';
        this.image = '';
        this.name = '';
    }
    fillModel(id) {
        const response = Net.getHostel(id);
        response.then((response) => {
            if (response.status !== 200) {
                Events.trigger('errorHostel');
                return;
            }
            const body = response.body;
            this.description = body.description;
            this.id = body.id;
            this.name = body.name;
            this.image = body.image;
            Events.trigger('updateHostel');
        });
    }
}
