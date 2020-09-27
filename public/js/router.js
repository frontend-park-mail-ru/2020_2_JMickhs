// роутер, работает только по якорям, надо доработать =)
class Router {
    routes = []
    constructor() {}

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
        controller.activate();
        // if (component === AuthPage) {
        //     signupPageRender();
        // } else {
        //     application.innerHTML = component.render();
        // }
    }

    start() {
        window.addEventListener('hashchange', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
    }
}