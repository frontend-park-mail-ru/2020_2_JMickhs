import PageView from '../basic/pageView';
import Events from '../../helpers/eventbus/eventbus';

/** Класс представления вырвиглазного поиска */
export default class SearchView extends PageView {
    /**
     * Рендер вырвиглазногго поиска
     */
    render() {
        this.page.innerHTML = '<div style="margin-top: 200px"><input class="search" type="text" id="search-input"/>' +
        '<button class="search-btn" id="search-btn" style="width: 50px; height: 50px; background-color: red"/></div>';

        const btn = document.getElementById('search-btn');
        const input = document.getElementById('search-input');
        btn.addEventListener('click', () => {
            Events.trigger('search', input.value);
        });
    }
}
