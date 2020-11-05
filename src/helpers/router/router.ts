import { PageController } from '@interfaces/controllers';
import { AbstractRouter } from '@interfaces/routers';

class Router implements AbstractRouter {
    private routes: Record<string, PageController>;

    private currController: PageController;

    errorController: PageController;

    private prevUrl: string;

    private curUrl: string;

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
        return this.prevUrl !== undefined;
    }

    goBack(): void {
        if (!this.canBack()) {
            return;
        }
        this.pushState(this.prevUrl);
    }

    pushState(url = '/', state?: unknown): void {
        if (url !== window.location.pathname) {
            window.history.pushState(state, document.title, url);
        } else {
            window.history.replaceState(state, document.title, url);
        }
        this.route();
    }

    private findControllerByPath(path: string): PageController {
        return this.routes[path];
    }

    private route(evt?: unknown): void {
        if (evt instanceof Event) {
            evt.preventDefault();
        }

        const splitUrl = window.location.pathname.split('/');
        const path = `/${splitUrl[1]}`;
        const arg = splitUrl[2];
        const controller = this.findControllerByPath(path) || this.errorController;

        const url = new URL(window.location.href);
        if (this.currController === controller && controller.updateParams) {
            controller.updateParams(url.searchParams);
            return;
        }

        if (this.currController) {
            this.currController.deactivate();
        }

        if (this.curUrl) {
            this.prevUrl = this.curUrl;
        }
        this.curUrl = window.location.href;
        this.currController = controller;
        controller.activate(arg);

        if (url.searchParams && controller.updateParams) {
            controller.updateParams(url.searchParams);
        }
    }
}

export default new Router();
