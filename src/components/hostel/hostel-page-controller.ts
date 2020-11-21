import type { HostelData } from '@interfaces/structs-data/hostel-data';
import type { CommentData } from '@network/structs-server/comment-data';
import HostelPageModel from '@hostel/hostel-page-model';
import HostelPageView from '@hostel/hostel-page-view';
import Events from '@eventbus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventbus/constants';
import Redirector from '@router/redirector';

import type { PageController } from '@interfaces/controllers';

export default class HostelPageController implements PageController {
    private model: HostelPageModel;

    private view: HostelPageView;

    constructor(place: HTMLElement) {
        this.model = new HostelPageModel();
        this.view = new HostelPageView(place);
    }

    private renderView = (data: { isAuth: boolean, hostel: HostelData, comment: CommentData }): void => {
        this.view.render(data);
    };

    activate(params?: URLSearchParams): void {
        if (!params) {
            Redirector.redirectError('Такого отеля не существует');
        }

        const id = Number(params?.get('id'));
        if (!id || id <= 0) {
            Redirector.redirectError('Такого отеля не существует');
            return;
        }

        Events.subscribe(UPDATE_HOSTEL, this.renderView);

        this.model.fillModel(id);
    }

    deactivate(): void {
        Events.unsubscribe(UPDATE_HOSTEL, this.renderView);
        this.view.hide();
    }
}
