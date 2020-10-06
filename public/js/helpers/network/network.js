/** Класс для работы с сетью */
export default class Net {
  /**
     * @return {string} Возвращает домен удаленного сервера
     */
  static get domen() {
    return 'http://www.hostelscan.ru';
  }
  /**
     * @return {string} Возвращает порт удаленного сервера
     */
  static get port() {
    return ':8080';
  }
  /**
     * @param {string} path - Относительный путь
     * @return {string} Возвращает адресс файла
     */
  static getUrlFile(path) {
    return this.domen + this.port + '/' + path;
  }
  /**
     * Выход из аккаунта
     * @return {Promise<number|Error>} Возвращает статус ответа или ошибку
     */
  static signout() {
    return fetch(this.domen + this.port + '/api/v1/signout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': this._csrf,
      },
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      return response.status;
    }).catch((err) => {
      return err;
    });
  }
  /**
     * Обновление аватара
     * @param {FormData} data - Форма с картинкой, имя у которой avatar
     * @return {Promise<number|Error>} Возвращает статус ответа или ошибку
     */
  static updateAvatar(data) {
    let statusCode = -1;
    return fetch(this.domen + this.port + '/api/v1/updateAvatar', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': this._csrf,
      },
      body: data,
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      statusCode = response.status;
      return statusCode;
    }).catch((err) => {
      return err;
    });
  }
  /**
     * Запрашивает пользователя используя куки
     * @return {Promise<{number, json}|{number, Error}>} number - statusCode, json - ответ
     */
  static getCurrUser() {
    let statusCode = -1;
    return fetch(this.domen + this.port + '/api/v1/get_current_user', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      statusCode = response.status;
      return response.json();
    }).then((json) => {
      return {status: statusCode, body: json};
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
  /**
     * Авторизация
     * @param {string} username - логин
     * @param {string} password - пароль
     * @return {Promise} number - statusCode, json - ответ
     */
  static signin(username, password) {
    let statusCode = -1;
    let json;
    try {
      json = JSON.stringify({
        username: username,
        password: password,
      });
    } catch (err) {
      return Promise.reject(new Error('invalid json'));
    }

    return fetch(this.domen + this.port + '/api/v1/signin', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: json,
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      statusCode = response.status;
      return response.json();
    }).then((json) => {
      return {status: statusCode, body: json};
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
  /**
     * Регистрация
     * @param {string} username - логин
     * @param {string} password - пароль
     * @return {Promise<{number, json}|{number, Error}>} number - statusCode, json - ответ
     */
  static signup(username, password) {
    let statusCode = -1;
    let json;
    try {
      json = JSON.stringify({
        username: username,
        password: password,
      });
    } catch (err) {
      return Promise.reject(new Error('invalid json'));
    }

    return fetch(this.domen + this.port + '/api/v1/signup', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: json,
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      statusCode = response.status;
      return response.json();
    }).then((json) => {
      return {status: statusCode, body: json};
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
  /**
     * Получение всех отелей
     * @return {Promise<{number, json}|{number, Error}>} number - statusCode, json - ответ
     */
  static getHotels() {
    let statusCode = -1;
    return fetch(this.domen + this.port + '/api/v1/hotels', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      statusCode = response.status;
      this._csrf = response.headers.get('csrf');
      return response.json();
    }).then((json) => {
      return {status: statusCode, body: json};
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
  /**
     * Обновление пароля
     * @param {string} oldPassword - старый пароль
     * @param {string} password - новый пароль
     * @return {Promise<number|{number, Error}>}
     */
  static updatePassword(oldPassword, password) {
    let statusCode = -1;
    let json;
    try {
      json = JSON.stringify({
        newpassword: password,
        oldpassword: oldPassword,
      });
    } catch (err) {
      return Promise.reject(new Error('invalid json'));
    }

    return fetch(this.domen + this.port + '/api/v1/updatePassword', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': this._csrf,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: json,
    }).then((response) => {
      this._csrf = response.headers.get('csrf');
      statusCode = response.status;
      return statusCode;
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
  /**
     * Получение определнных отелей
     * @param {number} id - id отеля
     * @return {Promise<{number, json}|{number, Error}>}
     * number - statusCode, json - ответ
     */
  static getHostel(id) {
    let statusCode = -1;
    return fetch(this.domen + this.port + `/api/v1/hotel/${id}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      statusCode = response.status;
      this._csrf = response.headers.get('csrf');
      return response.json();
    }).then((json) => {
      return {status: statusCode, body: json};
    }).catch((err) => {
      return {status: statusCode, error: err};
    });
  }
}
