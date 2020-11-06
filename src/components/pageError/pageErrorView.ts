import { PageView } from '@interfaces/views';

import * as template from '@pageError/templates/pageError.hbs';

export default class ErrorPageView extends PageView {
    render(err: string|null): void {
        let errStr = 'Такой страницы не существует';
        if (err) {
            errStr = err;
        }
        this.page.innerHTML = template({ error: errStr });
    }
}
