import HomeModel from '@home/home-model';
import HomeView from '@home/home-view';
import type { PageController } from '@interfaces/controllers';

export default class HomeController implements PageController {
    private model: HomeModel;

    private view: HomeView;

    constructor(place: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(place);
    }

    activate(params?: URLSearchParams): void {
        this.view.render();
        if (params) {
            this.updateParams(params);
        }
    }

    deactivate(): void {
        this.view.hide();
    }

    updateParams(params: URLSearchParams): void {
        const pattern = params.get('pattern');
        if (pattern === null) {
            this.view.listComponentOff();
        } else {
            this.model.search(`?${params.toString()}`);
            this.view.listComponentOn(pattern);
        }
    }
}
