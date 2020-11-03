import { PageView } from '@interfaces/views';

import * as template from '@pageError/templates/page.hbs';

export default class ErrorPageView extends PageView {
    render(err: string|null): void {
        let errStr = 'Такой страницы не существует';
        if (err !== undefined || err !== null) {
            errStr = err;
        }
        this.page.innerHTML = template({ error: errStr });
    }
}
