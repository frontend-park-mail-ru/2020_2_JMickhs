import ListModel from '@list/listModel';
import ListView from '@list/listView';
import { ResponseData } from '@/helpers/network/structsServer/resposeData';
import { AbstractController } from '@interfaces/controllers';
import Events from '@eventBus/eventbus';
import { LOAD_HOSTELS } from '@eventBus/constants';

export default class ListController implements AbstractController {
    private model: ListModel;

    private view: ListView;

    public haveInfo: boolean;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor(parent: HTMLElement) {
        this.model = new ListModel();
        this.view = new ListView(parent);
        this.haveInfo = false;

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, (arg: unknown) => void> {
        const handlers = {
            renderHoslels: () => {
                this.view.render(this.model.hostels);
            },
        };
        return handlers;
    }

    private subscribeEvents(): void {
        Events.subscribe(LOAD_HOSTELS, this.handlers.renderHoslels);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(LOAD_HOSTELS, this.handlers.renderHoslels);
    }

    activate(handler?: Promise<ResponseData>): void {
        this.subscribeEvents();
        if (!this.haveInfo) {
            this.model.fillModel(handler);
        }
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.view.hide();
        this.haveInfo = false;
    }
}
