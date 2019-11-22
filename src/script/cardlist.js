import {Card} from './card.js';
import {apiComponent} from './api.js';


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
  
  const cardContainer = document.querySelector('.places-list');
  const cardListComponent = new CardList(cardContainer);

  export {CardList, cardListComponent};

  