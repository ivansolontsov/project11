import {apiComponent} from './api.js';

export class Card {
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
        const popupLightbox = document.querySelector('#lightbox');
        popupLightbox.classList.add('popup_is-opened'); // открываем наш попап для лайтбокса
        const lightboxImage = document.querySelector('.popup__lightbox-image'); // img тег куда вставлять картинку
        lightboxImage.setAttribute(`src`, `${this.link}`); // задаем атрибуты для имг
        lightboxImage.setAttribute(`alt`, `${this.name}`); // задаем атрибуты для имг
      }
    }
    createCard() {
      const authorName = document.querySelector('.user-info__name');
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