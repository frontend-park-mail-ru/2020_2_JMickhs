interface NavElem {
    text: string,
    href: string,
    active: boolean;
}

export default class NavModel {
    
    private arr: NavElem[];
    public active: number;
    
    constructor() {
        this.arr = [
            {text: 'HostelScan', href: '/', active: false},
            {text: 'Список отелей', href: '/list', active: false},
            {text: 'Авторизация', href: '/signin', active: false},
        ];
        this.active = -1;
    }

    getData(): {elems: NavElem[], active: number} {
        return {elems: this.arr, active: this.active};
    }

    updateElem(index: number, elem: NavElem): void {
        if (index < 0 && index >= this.arr.length) {
            return;
        }
        this.arr[index] = elem;
    }

    updateActive(index: number): void {
        this.arr.forEach((elem) => {
            elem.active = false;
        });
        if (index < 0 && index >= this.arr.length) {
            return;
        }
        this.arr[index].active = true;
    }
}