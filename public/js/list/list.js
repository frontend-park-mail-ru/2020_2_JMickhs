class HotelInfo {
    constructor(name, id, description) {
        this._name = name;
        this._id = id;
        this._description = description;
    }
}


/**
 * The Model.
 */
class ListModel extends EventEmitter {
    constructor(hotels = []) {
        super();
        this.a = 0;
        this._hotels = hotels;
    }

    callback(status, response) {
        this._hotels[this._hotels.length] = Ext.util.JSON.decode(response);
        //this._hotels[this._hotels.length] = '3';
        this.a = 1;
        this.do('kek', 'how are you?');
    }

    getHotelsFromDB() {
        ajax(
             'GET',
             'http://89.208.197.127:8080/api/v1/hotels', {},
            (status, response) => {
                 console.log(response);
                 //response.toArray().forEach((item) => { this._hotels[this._hotels.length] = item; });
            }
         );

        this.do('getHotels', () => {console.log('AAA')});

        return this.a;
    }

    getItems() {
        return this._hotels.slice();
    }
}


/**
 * The View.
 */
class ListView extends EventEmitter {
    constructor(model) {
        super();
        this.app = document.getElementById('app');
        this._model = model;
        this._model.subscribe('getHotels', this.show.bind(this));
    }

    show() {
        let navbar = new Navbar();
        this.app.innerHTML = navbar.render('home', 'list', 'signin', 2) + `
           <div class="card">
        <img class="avatar" src="img/mbs41.jpg" alt="Avatar">
        <div class="container">
            <div class="cnt">
                <h3>
                    <b>${this._model._hotels[0]}</b>
                </h3>
                <h3>
                    <b>тел.: 8(283)293-92-00</b>
                </h3>
            </div>
            <button class="btn">Подробнее</button>
        </div>
        </div>
        `;
    }
}


/**
 * The Controller.
 */
class ListController {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }

    activate() {
        this._model.getHotelsFromDB();
        this._view.show();
    }
}

function createListController() {
    let model = new ListModel('1', '2');
    let view = new ListView(model);
    return new ListController(model, view);
}
