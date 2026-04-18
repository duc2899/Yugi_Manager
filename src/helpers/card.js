import { EXTRA_TYPES } from "config/card";
import { DECK_LIMIT } from "config/card";
import { CARD_TYPE } from "config/card";

// ======================== BUILD PARAMS ========================
export const buildParams = (pageNumber, filter) => {
    const params = {
        page: pageNumber,
        limit: 90,
    };

    Object.entries(filter).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;

        if (Array.isArray(value)) {
            if (value.length === 0) return;
            params[key] = value.join(",");
            return;
        }

        params[key] = value;
    });

    return params;
};

// ======================== VALIDATE ========================
export const validateDeck = (card, deck, zone) => {
    if (!card) {
        alert("Card không hợp lệ!");
        return false;
    }

    // ===== MAIN =====
    if (zone === "MAIN") {
        if (deck.mainDeck.length >= DECK_LIMIT.MAIN) {
            alert(`Main Deck tối đa ${DECK_LIMIT.MAIN} lá!`);
            return false;
        }

        if (card.type === CARD_TYPE.SPELL || card.type === CARD_TYPE.TRAP) return true;

        if (card.type === CARD_TYPE.MONSTER) {
            if (EXTRA_TYPES.includes(card.category)) {
                alert("Fusion/Synchro/Xyz/Link chỉ được bỏ vào Extra Deck!");
                return false;
            }
            return true;
        }

        alert("Loại card này không được phép vào Main Deck!");
        return false;
    }

    // ===== EXTRA =====
    if (zone === "EXTRA") {
        if (deck.extraDeck.length >= DECK_LIMIT.EXTRA) {
            alert(`Extra Deck tối đa ${DECK_LIMIT.EXTRA} lá!`);
            return false;
        }

        if (card.type !== CARD_TYPE.MONSTER) {
            alert("Extra Deck chỉ nhận Monster!");
            return false;
        }

        if (!EXTRA_TYPES.includes(card.category)) {
            alert("Extra Deck chỉ nhận Fusion/Synchro/Xyz/Link!");
            return false;
        }

        return true;
    }

    // ===== SIDE =====
    if (zone === "SIDE") {
        if (deck.sideDeck.length >= DECK_LIMIT.SIDE) {
            alert(`Side Deck tối đa ${DECK_LIMIT.SIDE} lá!`);
            return false;
        }

        if (![CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP].includes(card.type)) {
            alert("Side Deck chỉ nhận Monster/Spell/Trap!");
            return false;
        }

        if (card.type === CARD_TYPE.MONSTER) {
            if (EXTRA_TYPES.includes(card.category)) {
                alert("Fusion/Synchro/Xyz/Link chỉ được bỏ vào Extra Deck!");
                return false;
            }
            return true;
        }

        return true;
    }

    return false;
};

// ======================== REMOVE 1 CARD ========================
export const removeCardFromDeck = (deck, cardId, from) => {
    const target =
        from === "MAIN"
            ? deck.mainDeck
            : from === "EXTRA"
                ? deck.extraDeck
                : deck.sideDeck;

    const index = target.findIndex((c) => c._id === cardId);
    if (index === -1) return;

    const qty = target[index].number || 1;

    if (qty > 1) {
        target[index].number = qty - 1;
    } else {
        target.splice(index, 1);
    }
};

// ======================== ADD CARD ========================
export const addCardToDeck = (deck, card, toZone) => {
    const target =
        toZone === "MAIN"
            ? deck.mainDeck
            : toZone === "EXTRA"
                ? deck.extraDeck
                : deck.sideDeck;

    const index = target.findIndex((c) => c._id === card._id);

    if (index !== -1) {
        target[index].number = (target[index].number || 1) + 1;
    } else {
        target.push({ ...card, number: 1 });
    }
};
// ======================== COUNT CARD IN ALL DECK ========================
export const countCardInAllDeck = (deck, name) => {
    const all = [...deck.mainDeck, ...deck.extraDeck, ...deck.sideDeck];

    return all
        .filter((c) => c.name === name)
        .reduce((sum, c) => sum + (c.number || 1), 0);
};