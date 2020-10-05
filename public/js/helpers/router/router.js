// роутер, работает только по якорям, надо доработать =)


const ErrorPage = {
    activate: () => {
        document.getElementById('page').innerHTML = `
        <p class="text-first">Уупс, произошла ошибка!</p>
        <p class="text">Такой страницы не существует</p>
      `;
    }
};


export default class Router {
    constructor() {
        this.routes = [];
    }

    append(path, controller) {
        this.routes[this.routes.length] = { path: path, controller: controller };
    }

    start() {
        window.addEventListener('popstate', this._route.bind(this));
        window.addEventListener('load', this._route.bind(this));
    }

    pushState(url = '/', state = {}) {
        if (url !== location.pathname) {
            history.pushState(state, document.title, url);
        } else {
            history.replaceState(state, document.title, url);
        }
        this._route();
    }

    _findComponentByPath(path) {
        return this.routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm')));
        // gm - это многострочный текст парни (вроде как)
    }

    _route(evt = null) {
        if (evt !== null) { 
            evt.preventDefault();
        }
        const path = location.pathname;
        console.log(path, 'path');
        const { controller } = this._findComponentByPath(path) || { controller: ErrorPage };
        controller.activate();
    }

}