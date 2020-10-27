
export interface AbstractView {
    render(data: unknown): void;
    hide(): void;
}

export class PageView implements AbstractView {
    protected page: HTMLElement;

    constructor(parent: HTMLElement) {
        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            parent.appendChild(page);
        }
        this.page = page;
    }

    render(data: unknown): void {
        this.page.innerHTML = data.toString();
    }

    hide(): void {
        this.page.innerHTML = '';
    }
}