class ProfileController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }
    activate() {
        if (this.model.isAuth) {
            this.view.show();
            return;
        }
        document.location.href = "#/signin"
    }
}

class ProfileView extends EventEmitter {
    constructor(model, elements) {
        super();
        this.model = model;
        this.app = document.getElementById('app');
        this.navbar = elements.navbar;
    }

    show() {
        this.navbar.el3 = { text: 'Профиль', ref: '#/profile' };

        this.app.innerHTML = this.app.innerHTML = this.navbar.render() + `
        <div class="container">
        <div class="card">
            <img class="avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSLxKO10UasXg7mO30FlOuE-DQCQCOZwdq1Pw&usqp=CAU" alt="Avatar">
            <div class="cnt">
                <h3>
                    <b>Логин: Serenehet</b>
                </h3>
                <h3>
                    <b>Email: seren_predatel@sas.ru</b>
                </h3>
                <h3>
                    <b>тел.: 8(283)293-92-00</b>
                </h3>
            </div>
        </div>

        <form action="" class="ui-form">
            <h2>Изменить данные</h2>
            <div class="form-row">
                <input type="text" id="login" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required autocomplete="off"><label for="email">Логин</label>
            </div>
            <div class="form-row">
                <input type="text" id="email" required autocomplete="off"><label for="password">Email</label>
            </div>
            <div class="form-row">
                <input type="password" id="password" required autocomplete="off"><label for="password">Старый пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password" required autocomplete="off"><label for="password">Новый пароль</label>
            </div>
            <button class="btn" href="/profile.html">Сохранить</button>
        </form>
        </div>
        `;



    }
}