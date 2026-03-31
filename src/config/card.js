import wind from 'assets/images/attributes/wind.png';
import dark from 'assets/images/attributes/dark.png';
import divine from 'assets/images/attributes/divine.png';
import earth from 'assets/images/attributes/earth.png';
import fire from 'assets/images/attributes/fire.png';
import light from 'assets/images/attributes/light.png';
import water from 'assets/images/attributes/water.png';


import normal from 'assets/images/spell/normal.png';
import continuous from 'assets/images/spell/continuous.png';
import counter from 'assets/images/spell/counter.png';
import equip from 'assets/images/spell/equip.png';
import field from 'assets/images/spell/field.png';
import ritual from 'assets/images/spell/ritual.png';
import quickPlay from 'assets/images/spell/quickPlay.png';

export const TYPE_SPELLS = [
    { key: "NORMAL", name: "Normal", icon: normal },
    { key: "FIELD", name: "Field", icon: field },
    { key: "EQUIP", name: "Equip", icon: equip },
    { key: "QUICK_PLAY", name: "Quick Play", icon: quickPlay },
    { key: "CONTINUOUS", name: "Continuous", icon: continuous },
    { key: "RITUAL", name: "Ritual", icon: ritual },
];

export const TYPE_TRAPS = [
    { key: "NORMAL", name: "Normal", icon: normal },
    { key: "CONTINUOUS", name: "Continuous", icon: continuous },
    { key: "COUNTER", name: "Counter", icon: counter },
];

export const TYPE_CATEGORIES_MONSTERS = [
    { key: "NORMAL", name: "Normal", icon: "" },
    { key: "EFFECT", name: "Effect", icon: "" },
    { key: "FUSION", name: "Fusion", icon: "" },
    { key: "SYNCHRO", name: "Synchro", icon: "" },
    { key: "RITUAL", name: "Ritual", icon: "" },
    { key: "XYZ", name: "Xyz", icon: "" },
    { key: "LINK", name: "Link", icon: "" },
    { key: "PENDULUM", name: "Pendulum", icon: "" },
    { key: "TOKEN", name: "Token", icon: "" },
    { key: "GEMINI", name: "Gemini", icon: "" },
    { key: "SPIRIT", name: "Spirit", icon: "" },
    { key: "TOON", name: "Toon", icon: "" },
    { key: "UNION", name: "Union", icon: "" },
    { key: "FLIP", name: "Flip", icon: "" },
    { key: "TUNER", name: "Tuner", icon: "" },
];

const TYPE_MONSTERS = [
    { key: "AQUA", name: "Aqua" },
    { key: "BEAST", name: "Beast" },
    { key: "BEAST-WARRIOR", name: "Beast-Warrior" },
    { key: "CREATOR GOD", name: "Creator God" },
    { key: "CYBERSE", name: "Cyberse" },
    { key: "DINOSAUR", name: "Dinosaur" },
    { key: "DIVINE-BEAST", name: "DIVINE-BEAST" },
    { key: "DRAGON", name: "Dragon" },
    { key: "FAIRY", name: "Fairy" },
    { key: "FIEND", name: "Fiend" },
    { key: "FISH", name: "Fish" },
    { key: "INSECT", name: "Insect" },
    { key: "MACHINE", name: "Machine" },
    { key: "PLANT", name: "Plant" },
    { key: "PSYCHIC", name: "Psychic" },
    { key: "PYRO", name: "Pyro" },
    { key: "REPTILE", name: "Reptile" },
    { key: "ROCK", name: "Rock" },
    { key: "SEA SERPENT", name: "Sea Serpent" },
    { key: "SPELLCASTER", name: "Spellcaster" },
    { key: "THUNDER", name: "Thunder" },
    { key: "WARRIOR", name: "Warrior" },
    { key: "WINGED BEAST", name: "Winged Beast" },
    { key: "WYRM", name: "Wyrm" },
    { key: "ZOMBIE", name: "Zombie" }
];

const TYPE_ATTRIBUTES = [
    {
        key: 'DARK',
        name: 'Dark',
        icon: dark
    },
    {
        key: 'LIGHT',
        name: 'Light',
        icon: light
    },
    {
        key: 'EARTH',
        name: 'Earth',
        icon: earth
    },
    {
        key: 'WATER',
        name: 'Water',
        icon: water
    },
    {
        key: 'FIRE',
        name: 'Fire',
        icon: fire
    },
    {
        key: 'WIND',
        name: 'Wind',
        icon: wind
    },
    {
        key: 'DIVINE',
        name: 'Divine',
        icon: divine
    }
]

const CARD_TYPES = [
    { key: "MONSTER", name: "Monster" },
    { key: "SPELL", name: "Spell" },
    { key: "TRAP", name: "Trap" },
];

const CARD_TYPE = {
    MONSTER: "MONSTER",
    SPELL: "SPELL",
    TRAP: "TRAP",
};

const ATTRIBUTE_ICONS = {
    dark,
    light,
    earth,
    water,
    fire,
    wind,
    divine
}

const SPELL_ICONS = {
    normal,
    field,
    equip,
    quickPlay,
    continuous,
    ritual
}

const TRAP_ICONS = {
    normal,
    continuous,
    counter
}

const TYPE_BY_CATEGORY = {
    MONSTER: TYPE_CATEGORIES_MONSTERS,
    SPELL: TYPE_SPELLS,
    TRAP: TYPE_TRAPS,
};

export { CARD_TYPES, CARD_TYPE, TYPE_ATTRIBUTES, TYPE_MONSTERS, ATTRIBUTE_ICONS, SPELL_ICONS, TRAP_ICONS, TYPE_BY_CATEGORY };