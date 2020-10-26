
class FilesNet {

    private domain: string;

    constructor() {
        this.domain = 'http://s3.hostelscan.ru/';
    }

    getUrlFile(path: string): string {
        return this.domain + path;
    }
}

export default new FilesNet();