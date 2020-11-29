import React, { useState, useRef } from 'react';
import TrelloCard from 'view/components/TrelloCard';

const cardData = {
  isLoading: false,
  processNumber: '08660.074443/2017-21​',
  cardID: '1',
  name: 'Nome do cartão',
  description: 'linha 1\nlinha 2',
  due: '2018-06-09T14:00:00.000Z',
  dueComplete: true,
  labels: [
    {
      color: 'red',
      label: 'urgente',
    },
  ],
  location: {
    board: {
      id: '1',
      name: 'SEI',
    },
    list: {
      id: '2',
      name: 'Pendentes',
    },
  },
  url: 'http://www.google.com',
};

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
    >08660.004033/2018-02</a>`;
  const anchor = template.content.firstElementChild.cloneNode(true);
  return anchor;
};

const TrelloCardPlayground = () => {
  const [data, setData] = useState(cardData);
  const anchor = useRef(generateAnchor());

  const updateData = (newData) => {
    console.log(newData);
    setData({ ...data, isLoading: true });
    window.setTimeout(() => {
      setData({ ...data, ...newData, isLoading: false });
    }, 500);
  };

  return (
    <TrelloCard
      {...data}
      refreshCard={(cardID) => updateData({})}
      deleteCard={(cardID) => console.log('delete: ', cardID)}
      onChangeName={(cardID, newName) => updateData({ name: newName })}
      onChangeDescription={(cardID, newDescription) => updateData({ description: newDescription })}
      onChangeLocation={(cardID, type, newLocation) => updateData({ [type]: newLocation })}
      onChangeDue={(cardID, due, dueComplete) => updateData({ due: due, dueComplete: dueComplete })}
      hasAnotherCard={false}
      fullWidth={false}
      originalAnchor={anchor.current}
    ></TrelloCard>
  );
};

export default TrelloCardPlayground;
