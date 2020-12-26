import React, { useState, useRef, useEffect, useCallback } from 'react';
import TrelloCard from 'view/components/TrelloCard';

import * as store from 'model/store.js';
import * as actions from 'actions/trello.js';

const generateAnchor = () => {
  const template = document.createElement('template');
  template.innerHTML = `<a
      class="processoVisualizado processoVisitado"
      href="#"
      onmouseover="return infraTooltipMostrar(
        'Especificação do processo.',
        'Tipo do processo.'
      );"
      onmouseout="return infraTooltipOcultar();"
    >00000.000001/2020-01</a>`;
  const anchor = template.content.firstElementChild.cloneNode(true);
  return anchor;
};

const TrelloCardPlayground = () => {
  const [card, setCard] = useState(null);
  const anchor = useRef(generateAnchor());

  const updateCard = useCallback(() => {
    const data = store.getData();
    if (data.cards && data.cards.length > 0) {
      const updatedCard = data.cards[0];
      setCard({ ...updatedCard });
    } else {
      setCard(null);
    }
  }, []);

  useEffect(() => {
    window.MockedTrelloApi.setDelay(250);
    window.MockedTrelloApi.clearCards();
    window.MockedTrelloApi.setBoards([
      {
        id: 'board1',
        name: 'Quadro 1',
      },
      {
        id: 'board2',
        name: 'Quadro 2',
      },
    ]);
    window.MockedTrelloApi.setLists([
      {
        id: 'list1',
        name: 'Lista 1',
      },
      {
        id: 'list2',
        name: 'Lista 2',
      },
    ]);
    window.MockedTrelloApi.addCard({
      name: 'Nome do cartão',
      desc: 'SEI 00000.000001/2020-01\nDescrição do cartão',
    });
    actions.refreshCards();
    store.onDataChanged(() => updateCard());
    return () => {
      store.clearEvents();
    };
  }, [updateCard]);

  return (
    card && (
      <TrelloCard
        {...card}
        refreshCard={(cardID) => actions.refreshCardData(cardID)}
        deleteCard={(cardID) => actions.deleteCard(cardID)}
        onChangeName={(cardID, newName) => actions.updateCardData(cardID, { name: newName })}
        onChangeDescription={(cardID, newDescription) =>
          actions.updateCardData(cardID, { description: newDescription })
        }
        onChangeLocation={(cardID, type, newLocation) => actions.updateCardData(cardID, { [type]: newLocation })}
        onChangeDue={(cardID, due, dueComplete) =>
          actions.updateCardData(cardID, { due: due, dueComplete: dueComplete })
        }
        hasAnotherCard={false}
        fullWidth={false}
        originalAnchor={anchor.current}
      ></TrelloCard>
    )
  );
};

export default TrelloCardPlayground;
