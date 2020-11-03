import ListModel from '@list/listModel';
import ListView from '@list/listView';
import {ResponseData} from '@interfaces/structsData/resposeData';

export default class ListController {
    private model: ListModel;
    private view: ListView;
    public haveInfo: boolean;

    constructor(parent: HTMLElement) {
        this.model = new ListModel();
        this.view = new ListView(parent);
        this.haveInfo = false;
    }

    activate(handler?: Promise<ResponseData>): void {
        this.view.subscribeEvents();
        if (!this.haveInfo) {
            this.model.fillModel(handler);
        }
    }

    deactivate(): void {
        this.view.hide();
        this.view.unsubscribeEvents();
        this.haveInfo = false;
    }
}
