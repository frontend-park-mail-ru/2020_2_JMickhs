import Events from '@eventBus/eventbus';
import {REDIRECT} from '@eventBus/constants';

/** Нет пока домашней страницы, просто редиректим на страницу списка */
export default class HomeController {

    private parent: HTMLElement;
    
    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    activate(): void {
        Events.trigger(REDIRECT, {url: '/list'});
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate(): void {
        // тут пока нечего делать =(
    }
}
