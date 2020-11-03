import {AbstractController} from '@interfaces/controllers';

class Router {

    private routes: Record<string, AbstractController>;

    private currController: AbstractController;
    public errorController: AbstractController;
    private prevUrl: string;
    private curUrl: string;

    constructor() {
        this.routes = {};
    }

    append(path: string, controller: AbstractController): void {
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

    canBack() {
        return this.prevUrl !== undefined;
    }

    goBack(): void {
        if (!this.canBack()) {
            return;
        }
        this.pushState(this.prevUrl);
    }

    pushState(url = '/', state: unknown = null): void {
        if (url !== location.pathname) {
            history.pushState(state, document.title, url);
        } else {
            history.replaceState(state, document.title, url);
        }
        this.route();
    }

    private findControllerByPath(path: string): AbstractController {
        return this.routes[path];
    }

    private route(evt?: unknown) {
        if (evt instanceof Event) {
            evt.preventDefault();
        }

        const splitUrl = location.pathname.split('/');
        const path = '/' + splitUrl[1];
        const arg = splitUrl[2];
        const controller = this.findControllerByPath(path) || this.errorController;

        if (this.currController === controller) {
            controller.updateParams();
            return;
        }

        if (this.currController) {
            this.currController.deactivate();
        }

        if (this.curUrl) {
            this.prevUrl = this.curUrl;
        }
        this.curUrl = location.href;
        this.currController = controller;
        controller.activate(arg);
    }

}

export default new Router();
