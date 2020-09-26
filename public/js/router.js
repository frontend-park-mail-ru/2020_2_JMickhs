// роутер, работает только по якорям, надо доработать =)
class Router {
    constructor(config) {
        this.routes = config;
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
        const { component } = this.findComponentByPath(path) || { component: ErrorPage };
        if (component === AuthPage) {
            signupPageRender();
        } else {
            application.innerHTML = component.render();
        }

    }

    start() {
        window.addEventListener('hashchange', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
        //window.addEventListener('popstate', this.route.bind(this));
    }
}