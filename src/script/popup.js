const popupForm = document.forms.new;
const popup = document.querySelector('.popup');
const popupButton = popup.querySelector('.popup__button');
const authorName = document.querySelector('.user-info__name');
const authorAbout = document.querySelector('.user-info__job');


import {apiComponent} from './api.js';
import {cardListComponent} from './cardlist.js';

class Popup {
    constructor(popup) {
      this.popup = popup;
      this.popup
        .querySelector('.popup__close')
        .addEventListener('click', this.close.bind(this));      
      // то, что будет меняться в зависимости от нажатой кнопки.
      popupForm.addEventListener('input', this.validate);
    }
    open() {
      this.popup.classList.add('popup_is-opened');
    }
    close() {
      this.popup.classList.remove('popup_is-opened');
      popupForm.reset();
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
  
  class NewCardPopup extends Popup {
    constructor(popup) {
        super(popup);
        this.popup = popup;
        const popupTitle = this.popup.querySelector('.popup__title');
        const popupButton = this.popup.querySelector('.popup__button');
        const popupFirstInput = popupForm.elements.name;
        const popupSecondInput = popupForm.elements.link;
  
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
  }
  
  class ProfilePopup extends Popup {
    constructor(popup) {
      super(popup);
      this.popup = popup;
      const popupTitle = this.popup.querySelector('.popup__title');
      const popupButton = this.popup.querySelector('.popup__button');
      const popupFirstInput = popupForm.elements.name;
      const popupSecondInput = popupForm.elements.link;
  
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
  }
  const popupConstructor = new Popup(popup);
  
  export {Popup, NewCardPopup, ProfilePopup};
  