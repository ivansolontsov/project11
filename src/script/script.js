const cardContainer = document.querySelector('.places-list');
const popup = document.querySelector('.popup');
const popupCloseLightbox = document.querySelector('.popup__close-lightbox');
const popupLightbox = document.querySelector('#lightbox');
const newCardButton = document.querySelector('.user-info__button'); 
const editButton = document.querySelector('.user-info__edit-button'); 

import {apiComponent} from './api.js';
import {CardList} from './cardlist.js';
import {Popup, NewCardPopup, ProfilePopup} from './popup.js';

const cardListComponent = new CardList(cardContainer);
const popupConstructor = new Popup(popup);

apiComponent.getUserInfo();
apiComponent.getInitialCards();
cardListComponent.render();

// закрытие попапов на эксейп
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

newCardButton.addEventListener('click', () => {
  const newCardPopupConstructor = new NewCardPopup(popup);
  popupConstructor.open();
});

editButton.addEventListener('click', () => {
  const editProfilePopupConstructor = new ProfilePopup(popup);
  popupConstructor.open();
})

document.addEventListener('mousedown', popupEventHandler);
document.addEventListener('keydown', popupEventHandler);
popupCloseLightbox.addEventListener('click', popupConstructor.close());