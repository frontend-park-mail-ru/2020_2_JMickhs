
class FilesNet {

    private domain: string;
    private port: string;

    constructor() {
        this.domain = 'http://www.hostelscan.ru';
        this.port = ':8080';
    }

    getUrlFile(path: string): string {
        return this.domain + this.port + '/' + path;
    }
}

export default new FilesNet();