import HomeModel from "@/components/home/homeModel";
import HomeView from "@/components/home/homeView";

/** Нет пока домашней страницы, просто редиректим на страницу списка */
export default class HomeController {
    private model: HomeModel;
    private view: HomeView;

    constructor(parent: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(parent);
    }

    activate(): void {
        this.view.render({});
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate(): void {
        // тут пока нечего делать =(
    }
}
