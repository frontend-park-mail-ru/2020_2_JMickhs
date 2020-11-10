import { PageController } from '@interfaces/controllers';
import { AbstractRouter } from '@interfaces/routers';

class Router implements AbstractRouter {
    private routes: Record<string, PageController>;

    private currController: PageController;

    errorController: PageController;

    private urlPrevious: string;

    private urlCurrent: string;

    constructor() {
        this.routes = {};
    }

    append(path: string, controller: PageController): void {
        this.routes[path] = controller;
    }

    start(): void {
        window.addEventListener('popstate', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
        window.addEventListener('click', (evt) => {
            let target = evt.target as Node;
            while (target.parentNode) {
                if (target instanceof HTMLAnchorElement) {
                    evt.preventDefault();
                    this.pushState(target.href);
                    return;
                }
                target = target.parentNode;
            }
        });
    }

    canBack(): boolean {
        return this.urlPrevious !== undefined;
    }

    goBack(): void {
        if (!this.canBack()) {
            return;
        }
        this.pushState(this.urlPrevious);
    }

    pushState(url = '/', state?: unknown): void {
        if (url !== window.location.pathname) {
            window.history.pushState(state, document.title, url);
        } else {
            window.history.replaceState(state, document.title, url);
        }
        this.route();
    }

    private route(evt?: unknown): void {
        if (evt instanceof Event) {
            evt.preventDefault();
        }

        if (this.urlCurrent) {
            this.urlPrevious = this.urlCurrent;
        }
        this.urlCurrent = window.location.href;

        const path = window.location.pathname;
        const controller = this.routes[path] || this.errorController;

        const url = new URL(window.location.href);
        const params = url.searchParams;

        if (this.currController === controller && controller.updateParams) {
            controller.updateParams(params);
            return;
        }

        if (this.currController) {
            this.currController.deactivate();
        }
        this.currController = controller;
        controller.activate(params);
    }
}

export default new Router();
