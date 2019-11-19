// контейнер для карточек
const cardContainer = document.querySelector('.places-list');

// попап
const popup = document.querySelector('.popup');

// формы
const popupForm = document.forms.new;

// лайтбокс
const popupCloseLightbox = document.querySelector('.popup__close-lightbox');
const popupLightbox = document.querySelector('#lightbox');

// кнопки вызывающие попапы
const newCardButton = document.querySelector('.user-info__button'); // новая карточка
const editButton = document.querySelector('.user-info__edit-button'); // редактировать профиль
const popupButton = popup.querySelector('.popup__button');

// userinfo
const authorName = document.querySelector('.user-info__name');
const authorAbout = document.querySelector('.user-info__job');


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
    fetch(`http://${this.ip}/${this.cohortId}/users/me`, {
      headers: {
        authorization: this.token
      }
    })
      .then(res => {
        return this.getResponseData(res);
      })
      .then((userinfo) => {
        authorName.textContent = userinfo.name;
        authorAbout.textContent = userinfo.about; 
      })
      .catch((err) => {
        console.log(err);
      });  
  }
  getInitialCards() { // получаем все карточки на сервере, сразу же рендерим их, так же отправляем в класс кардлиста все необходимые данные для индентификации каждой карточки.
    return fetch(`http://${this.ip}/${this.cohortId}/cards`, {
      headers: {
        authorization: this.token
      }
    }).then(res => {
        return this.getResponseData(res);
      })
  }
  patchUserInfo(name, about, button) { // при модификации кнопка меняет свой текст, так как время загрузки очень короткое, для того чтобы было как на видео, сделал фейковую загрузку, оно вообще нужно?(мне не нравится)
    button.textContent = 'Загрузка...';
    return fetch(`http://${this.ip}/${this.cohortId}/users/me`, {
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
    button.textContent = 'Загрузка...';
    return fetch(`http://${this.ip}/${this.cohortId}/cards`, {
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
    return fetch(`http://${this.ip}/${this.cohortId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this.token
      }
    }).then(result => {
      return this.getResponseData(result);
    });
  }
}

const apiComponent = new Api('95.216.175.5','b7462041-f41b-4c91-8efa-ceb04012fa87', 'cohort4');
apiComponent.getUserInfo();
apiComponent.getInitialCards();

class Card {
  constructor(name, link, likesAmount, cardId, cardOwner) {
    this.name = name;
    this.link = link;
    this.likes = likesAmount;
    this.id = cardId;
    this.cardOwner = cardOwner;
    this.cardElement = this.createCard(this.name, this.link);
    this.cardElement
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.likeCard);
    this.cardElement
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', () => { 
        this.removeCard();
      });
    this.cardElement
      .querySelector('.place-card__image')
      .addEventListener('click', this.openLightbox.bind(this));
  }
  likeCard(event) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }
  removeCard() {
    if (window.confirm(`Вы действительно хотите удалить карточку ${this.name}?`)) { 
      apiComponent.deleteCardFromServer(this.id)
      .then(result => {
        this.cardElement.remove();
      }).catch(err => {
        console.log(err);
      });
    }
  }
  openLightbox(event) {
    if(event.target.classList.contains('place-card__image')) {
      popupLightbox.classList.add('popup_is-opened'); // открываем наш попап для лайтбокса
      const lightboxImage = document.querySelector('.popup__lightbox-image'); // img тег куда вставлять картинку
      lightboxImage.setAttribute(`src`, `${this.link}`); // задаем атрибуты для имг
      lightboxImage.setAttribute(`alt`, `${this.name}`); // задаем атрибуты для имг
    }
  }
  createCard() {
    // main card
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');

    // top part
    // sobiraem kartinky
    const placeCardImage = document.createElement('div');
    placeCardImage.classList.add('place-card__image');
    placeCardImage.setAttribute('style', `background-image: url(${this.link});`)

    // sobiraem knopku
    const placeCardDeleteIcon = document.createElement('button');
    placeCardDeleteIcon.classList.add('place-card__delete-icon');

    // bottom part
    // собираем контейнер низа
    const placeCardDescription = document.createElement('div');
    placeCardDescription.classList.add('place-card__description');

    // собираем заголовок
    const placeCardName = document.createElement('h3');
    placeCardName.classList.add('place-card__name');
    placeCardName.textContent = this.name;

    // like button
    const placeCardLikeWrapper = document.createElement('div');
    placeCardLikeWrapper.classList.add('place-card__like-wrapper');

    const placeCardLikesAmount = document.createElement('p');
    placeCardLikesAmount.classList.add('place-card__like-text');
    placeCardLikesAmount.textContent = this.likes;

    const placeCardLikeIcon = document.createElement('button');
    placeCardLikeIcon.classList.add('place-card__like-icon');
    placeCardLikeWrapper.appendChild(placeCardLikeIcon);
    placeCardLikeWrapper.appendChild(placeCardLikesAmount);

    // merge
    placeCardImage.appendChild(placeCardDeleteIcon);

    if(this.cardOwner === authorName.textContent) { // почему-то иногда не появлется делет икон, не пойму почему(
      placeCardDeleteIcon.setAttribute('style', 'display: block');
    }
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLikeWrapper);

    placeCard.appendChild(placeCardImage);
    placeCard.appendChild(placeCardDescription);
    
    return placeCard;
  }
}

class CardList {
  constructor(elementContainer) {
      this.container = elementContainer;
    }
  render() {
    apiComponent.getInitialCards()
    .then((initialCards) => {
      initialCards.forEach(function(elem) {
          cardListComponent.addCard(elem.name, elem.link, elem.likes.length, elem._id, elem.owner.name);
      });
    })
    .catch((err) => console.log(err));
  }
  addCard(name, link, likesAmount, cardId, cardOwner) {
    const newCard = new Card(name, link, likesAmount, cardId, cardOwner);
    this.container.appendChild(newCard.cardElement);
  }
}

const cardListComponent = new CardList(cardContainer);
cardListComponent.render();

class Popup {
  constructor(popup, buttonPressed) {
    this.popup = popup;
    this.buttonPressed = buttonPressed;
    this.popup
      .querySelector('.popup__close')
      .addEventListener('click', this.close.bind(this));

    // то, что будет меняться в зависимости от нажатой кнопки.
    const popupTitle = this.popup.querySelector('.popup__title');
    const popupButton = this.popup.querySelector('.popup__button');
    const popupFirstInput = popupForm.elements.name;
    const popupSecondInput = popupForm.elements.link;

    if(buttonPressed === newCardButton) {
      popupTitle.textContent = "Новое место";
      popupButton.classList.remove('popup__button-save');
      popupButton.textContent = '+'; 
      popupFirstInput.placeholder = "Название";
      popupSecondInput.placeholder = "Ссылка на картинку";
  
      popupSecondInput.type = "url";
      popupSecondInput.removeAttribute('minlength');
      popupSecondInput.removeAttribute('maxlength');

      popupForm.removeEventListener('submit', this.editProfileInformation);
      popupForm.addEventListener('submit', this.addCardToContainer);
    }
    if(buttonPressed === editButton) {
      popupTitle.textContent = "Редактировать профиль";
      popupButton.classList.add('popup__button-save');
      popupButton.textContent = 'Сохранить';
      popupFirstInput.placeholder = "Имя";
      popupSecondInput.placeholder = "О себе";
      popupSecondInput.type = "text";
      popupSecondInput.setAttribute('minlength', '2');
      popupSecondInput.setAttribute('maxlength', '30');

      popupFirstInput.value = authorName.textContent;
      popupSecondInput.value = authorAbout.textContent;
  
      popupForm.removeEventListener('submit', this.addCardToContainer);
      popupForm.addEventListener('submit', this.editProfileInformation);
    }
    popupForm.addEventListener('input', this.validate);
  }
  open() {
    this.popup.classList.add('popup_is-opened');
  }
  close() {
    this.popup.classList.remove('popup_is-opened');
    popupForm.reset();
  }
  addCardToContainer(event) {
    event.preventDefault();

    const name = popupForm.elements.name.value;
    const link = popupForm.elements.link.value;

    apiComponent.addCardToServer(name, link, popupButton)
    .then(result => {
      cardListComponent.addCard(result.name, result.link, result.likes.length, result._id, result.owner.name);
      popupConstructor.close();
    }).catch(err => {
      console.log(err);
    });
  }
  editProfileInformation(event) {
    event.preventDefault(); 

    const name = popupForm.elements.name;
    const link = popupForm.elements.link;

    apiComponent.patchUserInfo(name.value, link.value, popupButton)
      .then(res => {
          authorName.textContent = name.value;
          authorAbout.textContent = link.value;
          popupConstructor.close();
      })
      .catch((err) => console.log(err));
  }
  validate() {
    const name = popupForm.elements.name;
    const url = popupForm.elements.link;
    const popupButton = document.querySelector('.popup__button');
    
    const popupName = document.querySelector('.popup__input_type_name');
    const nameError = document.querySelector('#name-error');
    const urlError = document.querySelector('#about-error')
  
    if (name.validity.valid) {
      nameError.setAttribute('style', 'display: none');
      popupName.setAttribute('style', 'margin-bottom: 24px');
      
      nameError.textContent = "";
    } else {
      nameError.setAttribute('style', 'display: inline');
      popupName.setAttribute('style', 'margin-bottom: 3px');

      nameError.textContent = name.validationMessage;
    }
  
    if (url.validity.valid) {
      urlError.setAttribute('style', 'display: none');
      urlError.innerHTML = "";
    } else {
      urlError.setAttribute('style', 'display: inline');
      urlError.textContent = url.validationMessage;
    }
  
    if (name.validity.valid === true && url.validity.valid === true) {
      popupButton.removeAttribute('disabled');
      popupButton.setAttribute('style', 'background-color: black; color: white');
    } else {
      popupButton.setAttribute('disabled', true);
      popupButton.removeAttribute('style');
    }
  }
}

function popupEventHandler(event) { 
  if(popup.classList.contains('popup_is-opened')) {
    if(event.target.classList.contains('popup')) {
      popupConstructor.close();
    }
    if(event.key === 'Escape') {
      popupConstructor.close();
    }
  }
  popupLightbox.classList.remove('popup_is-opened');
}




document.addEventListener('mousedown', popupEventHandler);
document.addEventListener('keydown', popupEventHandler); 


newCardButton.addEventListener('click', function() {
  const popupConstructor = new Popup(popup, newCardButton);
  popupConstructor.open();
});

editButton.addEventListener('click', function() {
  const popupConstructor = new Popup(popup, editButton);
  popupConstructor.open();
})

popupCloseLightbox.addEventListener('click', popupEventHandler);