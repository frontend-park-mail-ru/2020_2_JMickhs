// роутер, работает только по якорям, надо доработать =)

class Router {
    constructor() {
        this.routes = [];
    }

    append(path, controller) {
        this.routes[this.routes.length] = { path: path, controller: controller };
    }

    parseLocation() {
        //console.log(location.pathname)
        return location.hash.slice(1).toLowerCase() || '/';
    }

    findComponentByPath(path) {
        return this.routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
        // gm - это многострочный текст парни (вроде как)
    }

    async route() {
        const path = this.parseLocation();
        const { controller } = this.findComponentByPath(path) || { controller: ErrorPage };
        if (controller === ErrorPage) {
            application.innerHTML = controller.activate();
            return;
        }
        controller.activate();
    }

    start() {
        window.addEventListener('hashchange', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
    }
}