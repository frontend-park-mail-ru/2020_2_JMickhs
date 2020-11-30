import type { AbstractRouter } from '@interfaces/routers';
import Router from './router';

class Redirector {
    private router: AbstractRouter;

    constructor() {
        this.router = Router;
    }

    redirectTo(path: string, state?: unknown): void {
        this.router.pushState(path, state);
    }

    redirectBack(failBackUrl = '/'): void {
        if (this.router.canBack()) {
            this.router.goBack();
        } else {
            this.redirectTo(failBackUrl);
        }
    }

    redirectError(err: string, url = '/error'): void {
        this.router.pushState(url, err);
    }
}

export default new Redirector();
