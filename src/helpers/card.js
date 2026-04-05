import { DECK_LIMIT } from "config/card";
import { CARD_TYPE } from "config/card";

const buildParams = (pageNumber, filter) => {
    const params = {
        page: pageNumber,
        limit: 90,
    };

    Object.entries(filter).forEach(([key, value]) => {
        if (!value) return;

        // array → join
        if (Array.isArray(value) && value.length > 0) {
            params[key] = value.join(",");
        }

        // single value
        if (!Array.isArray(value)) {
            params[key] = value;
        }
    });

    return params;
};

const validateMainDeck = (card, deck) => {
    if (!card) {
        alert("Card không hợp lệ!");
        return false;
    }

    if (deck.mainDeck.length >= DECK_LIMIT.MAIN) {
        alert(`Main Deck tối đa ${DECK_LIMIT.MAIN} lá!`);
        return false;
    }

    if (card.type === CARD_TYPE.SPELL || card.type === CARD_TYPE.TRAP) {
        return true;
    }

    if (card.type === CARD_TYPE.MONSTER) {
        const extraTypes = ["FUSION", "SYNCHRO", "XYZ", "LINK"];

        if (extraTypes.includes(card.category)) {
            alert("Fusion/Synchro/Xyz/Link chỉ được bỏ vào Extra Deck!");
            return false;
        }

        return true;
    }

    alert("Loại card này không được phép vào Main Deck!");
    return false;
}

const validateExtraDeck = (card, deck) => {
    if (!card) {
        alert("Card không hợp lệ!");
        return false;
    }

    if (deck.extraDeck.length >= DECK_LIMIT.EXTRA) {
        alert(`Extra Deck tối đa ${DECK_LIMIT.EXTRA} lá!`);
        return false;
    }

    if (card.type !== CARD_TYPE.MONSTER) {
        alert("Extra Deck chỉ nhận Monster!");
        return false;
    }

    const extraTypes = ["FUSION", "SYNCHRO", "XYZ", "LINK"];

    if (!extraTypes.includes(card.category)) {
        alert("Extra Deck chỉ nhận Fusion/Synchro/Xyz/Link!");
        return false;
    }

    return true;
}

const validateSideDeck = (card, deck) => {
    if (!card) {
        alert("Card không hợp lệ!");
        return false;
    }

    if (deck.sideDeck.length >= DECK_LIMIT.SIDE) {
        alert(`Side Deck tối đa ${DECK_LIMIT.SIDE} lá!`);
        return false;
    }

    if (![CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP].includes(card.type)) {
        alert("Side Deck chỉ nhận Monster/Spell/Trap!");
        return false;
    }

    return true;
}

const removeCardFromDeck = (deck, cardId, from) => {
    const removeOnce = (arr) => {
        const index = arr.findIndex((c) => c._id === cardId);
        if (index !== -1) arr.splice(index, 1); // chỉ xoá 1 lá
    };

    if (from === "MAIN") removeOnce(deck.mainDeck);
    if (from === "EXTRA") removeOnce(deck.extraDeck);
    if (from === "SIDE") removeOnce(deck.sideDeck);
};

const addCardToDeck = (deck, card, toZone) => {
    if (toZone === "MAIN") deck.mainDeck.push(card);
    if (toZone === "EXTRA") deck.extraDeck.push(card);
    if (toZone === "SIDE") deck.sideDeck.push(card);
};




export { buildParams, validateMainDeck, validateExtraDeck, validateSideDeck, removeCardFromDeck, addCardToDeck }