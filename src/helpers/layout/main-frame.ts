import * as template from './main-frame.hbs';

export default class MainFrame {
    private parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.parent = parent;
    }

    createElements(idArray: string[]): void {
        this.parent.innerHTML += template({ array: idArray });
    }

    getElement(id: string): HTMLElement|undefined {
        return document.getElementById(id);
    }
}
