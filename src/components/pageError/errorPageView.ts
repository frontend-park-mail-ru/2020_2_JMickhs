import {PageView} from '@interfaces/views';

import * as template from '@pageError/templates/page.hbs';

export default class ErrorPageView extends PageView {

    constructor(parent: HTMLElement) {
        super(parent);
    }

    render(err: string|null): void {
        if (err === undefined || err === null) {
            err = 'Такой страницы не существует';
        }
        this.page.innerHTML = template({error: err});
    }
}