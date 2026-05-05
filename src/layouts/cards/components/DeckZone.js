import { useMaterialUIController } from "context";

import Zone from "./Zone";
import DeckCardItem from "./DeckCardItem";
import { validateDeck } from "../../../helpers/card";
import { DECK_LIMIT, CARD_TYPE } from "../../../config/card"
import { useCardHover } from "../../../hooks/useCardHover";
import CardHover from "./CardHover";

const DeckZones = ({ deck, handleDropCard, handleDragStartFromDeck }) => {
    const [controller] = useMaterialUIController();
    const { lang } = controller;
    const { hoverCard, pos, onMouseEnter, onMouseLeave } = useCardHover();
    return (
        <>
            <Zone
                title="Main Deck"
                cards={deck.mainDeckCards}
                onDropCard={(card) => {
                    handleDropCard(card, "MAIN")
                    onMouseLeave();
                }}
                renderCard={(card) => (
                    <div
                        draggable
                        style={{
                            margin: "10px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => onMouseEnter(card.data, e)}
                        onMouseLeave={onMouseLeave}
                    >
                        <DeckCardItem
                            card={card}
                            width={55}
                            onDragStart={(e) => handleDragStartFromDeck(e, card, "MAIN")}
                        />
                    </div>

                )}
                validateDrop={(card) => validateDeck(card, deck, "MAIN")}
                allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
                deckLimit={DECK_LIMIT.MAIN}
            />

            <Zone
                title="Extra Deck"
                cards={deck.extraDeckCards}
                onDropCard={(card) => {
                    handleDropCard(card, "EXTRA")
                    onMouseLeave();
                }}
                renderCard={(card) => (
                    <div
                        draggable
                        style={{
                            margin: "10px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => onMouseEnter(card.data, e)}
                        onMouseLeave={onMouseLeave}
                    >
                        <DeckCardItem
                            card={card}
                            width={55}
                            onDragStart={(e) => handleDragStartFromDeck(e, card, "EXTRA")}
                        />
                    </div>
                )}
                validateDrop={(card) => validateDeck(card, deck, "EXTRA")}
                allowTypes={["FUSION", "SYNCHRO", "XYZ", "LINK"]}
                deckLimit={DECK_LIMIT.EXTRA}
            />

            <Zone
                title="Side Deck"
                cards={deck.sideDeckCards}
                onDropCard={(card) => {
                    handleDropCard(card, "SIDE")
                    onMouseLeave();
                }}
                renderCard={(card) => (
                    <div
                        draggable
                        style={{
                            margin: "10px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => onMouseEnter(card.data, e)}
                        onMouseLeave={onMouseLeave}
                    >
                        <DeckCardItem
                            card={card}
                            width={55}
                            onDragStart={(e) => handleDragStartFromDeck(e, card, "SIDE")}
                        />
                    </div>
                )}
                validateDrop={(card) => validateDeck(card, deck, "SIDE")}
                allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
                deckLimit={DECK_LIMIT.SIDE}
            />
            {hoverCard && <CardHover hoverCard={hoverCard} lang={lang} pos={pos} />}
        </>
    );
};

export default DeckZones;