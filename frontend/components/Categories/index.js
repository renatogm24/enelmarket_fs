import { useState, useCallback, useEffect } from "react";
import { Category } from "./Category";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Categories({ cards, setCards, setErrorCategories }) {
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const deleteCard = useCallback((id, cardsAux) => {
    if (cardsAux.length <= 1) {
      setErrorCategories("No se puede quedar sin categorías");
      setTimeout(() => {
        setErrorCategories("");
      }, 2000);
    } else {
      setCards((prevCards) =>
        update(
          prevCards,
          //$splice: [[selectIndex, 1]],
          (prevCards) => prevCards.filter((item) => item.id !== id)
        )
      );
    }
  }, []);

  const renderCard = useCallback(
    (card, index, cards) => {
      return (
        <Category
          key={card.id}
          index={index}
          id={card.id}
          cards={cards}
          text={card.name}
          moveCard={moveCard}
          deleteCard={deleteCard}
        />
      );
    },
    [moveCard, deleteCard]
  );
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {cards.map((card, i) => renderCard(card, i, cards))}
      </DndProvider>
    </>
  );
}
