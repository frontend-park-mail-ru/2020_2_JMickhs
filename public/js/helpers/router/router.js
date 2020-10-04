// роутер, работает только по якорям, надо доработать =)


const ErrorPage = {
    activate: () => {
        document.getElementById('page').innerHTML = `
        <section>
          <h1>Error</h1>
          <p>Error Error Error</p>
        </section>
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

    parseLocation() {
        return location.hash.slice(1).toLowerCase() || '/';
    }

    findComponentByPath(path) {
        return this.routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
        // gm - это многострочный текст парни (вроде как)
    }

    async route(evt) {
        evt.preventDefault();
        const path = this.parseLocation();
        const { controller } = this.findComponentByPath(path) || { controller: ErrorPage };
        controller.activate();
    }

    start() {
        window.addEventListener('hashchange', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
    }
}