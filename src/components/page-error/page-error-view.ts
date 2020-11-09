import { PageView } from '@interfaces/views';

import * as template from '@page-error/templates/page-error.hbs';
import '@page-error/templates/page-error.css';

export default class ErrorPageView extends PageView {
    render(err: string|null): void {
        let errStr = 'Такой страницы не существует';
        if (err) {
            errStr = err;
        }
        this.page.innerHTML = template({ error: errStr });
    }
}
