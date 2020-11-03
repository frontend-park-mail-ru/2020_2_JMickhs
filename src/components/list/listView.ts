// import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {LOAD_HOSTELS} from '@eventBus/constants';
import * as listTemplate from '@list/templates/listTemplate.hbs';

export default class ListView {
    private handlers: Record<string, (arg: unknown) => void>;
    private page: HTMLElement;

    constructor(parent: HTMLElement) {
        const page = document.createElement('div');
        page.id = 'page1';
        parent.appendChild(page);
        this.page = page;

        this.handlers = {
            render: this.render.bind(this),
        };
    }

    subscribeEvents(): void {
        Events.subscribe(LOAD_HOSTELS, this.handlers.render);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(LOAD_HOSTELS, this.handlers.render);
    }

    render(data: unknown): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = listTemplate(data);
    }

    hide(): void {
        this.page.innerHTML = '';
    }
}
