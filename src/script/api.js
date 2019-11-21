  class Api {
    constructor(ip, token, cohortId) { // чтобы каждый раз не вводить токен и айди
      this.ip = ip;
      this.token = token;
      this.cohortId = cohortId;
    }
    getResponseData(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    getUserInfo() { // получаем данные с сервера и сразу добавляем их на страничку.
      fetch(`${this.ip}/${this.cohortId}/users/me`, {
        headers: {
          authorization: this.token
        }
      })
        .then(res => {
          return this.getResponseData(res);
        })
        .then((userinfo) => {
            const authorName = document.querySelector('.user-info__name');
            const authorAbout = document.querySelector('.user-info__job');
            authorName.textContent = userinfo.name;
            authorAbout.textContent = userinfo.about; 
        })
        .catch((err) => {
          console.log(err);
        });  
    }
    getInitialCards() { // получаем все карточки на сервере, сразу же рендерим их, так же отправляем в класс кардлиста все необходимые данные для индентификации каждой карточки.
      return fetch(`${this.ip}/${this.cohortId}/cards`, {
        headers: {
          authorization: this.token
        }
      }).then(res => {
          return this.getResponseData(res);
        })
    }
    patchUserInfo(name, about, button) { // при модификации кнопка меняет свой текст, так как время загрузки очень короткое, для того чтобы было как на видео, сделал фейковую загрузку, оно вообще нужно?(мне не нравится)
        button.textContent = 'Загрузка...';
      return fetch(`${this.ip}/${this.cohortId}/users/me`, {
        method: 'PATCH',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: `${name}`,
            about: `${about}`
        })
      }).then(result => {
        return this.getResponseData(result);
      });
    }
    addCardToServer(name, link, button) { // при добавлении карточки через попап, срабатывает вот эта функция, сразу же рендерим новую карту
      button.classList.add('popup__button-save');
      button.setAttribute('disabled', true);
      button.textContent = 'Загрузка...';
      return fetch(`${this.ip}/${this.cohortId}/cards`, {
        method: 'POST',
        headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: `${name}`,
            link: `${link}`
        })
      }).then(result => {
        return this.getResponseData(result);
      });
    }
    deleteCardFromServer(cardId) { // все просто
      return fetch(`${this.ip}/${this.cohortId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          authorization: this.token
        }
      }).then(result => {
        return this.getResponseData(result);
      });
    }
  }
  
  const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk' : 'https://praktikum.tk';
  const apiComponent = new Api(serverUrl,'b7462041-f41b-4c91-8efa-ceb04012fa87', 'cohort4');


  export {Api, apiComponent};