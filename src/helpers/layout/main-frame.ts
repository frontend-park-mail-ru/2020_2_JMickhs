import * as template from './main-frame.hbs';

export default class MainFrame {
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    createElements(idObject: Record<string, string>): void {
        this.parent.innerHTML += template({ object: idObject });
    }

    getElement(id: string): HTMLElement|undefined {
        return document.getElementById(id);
    }
}
