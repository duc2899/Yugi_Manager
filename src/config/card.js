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

const TYPE_CATEGORIES_MONSTERS = [
    {
        name: 'ALL',
        key: 'all'
    },
    {
        name: 'NORMAL',
        key: 'normal'
    },
    {
        name: 'EFFECT',
        key: 'effect'
    },
    {
        name: 'FUSION',
        key: 'fusion'
    },
    {
        name: 'SYNCHRO',
        key: 'synchro'
    },
    {
        name: 'RITUAL',
        key: 'ritual'
    },
    {
        name: 'XYZ',
        key: 'xyz'
    },
    {
        name: 'LINK',
        key: 'link'
    },
    {
        name: 'PENDULUM',
        key: 'pendulum'
    },
    {
        name: 'TOKEN',
        key: 'token'
    },
    {
        name: "GEMINI",
        key: "gemini"
    },
    {
        name: "SPIRIT",
        key: "spirit"
    },
    {
        name: "TOON",
        key: "toon"
    },
    {
        name: "UNION",
        key: "union"
    },
    {
        name: "FLIP",
        key: "flip"
    },
    {
        name: "TUNER",
        key: "tuner"
    }
]

const MONSTER_TYPES = [
    { name: "AQUA", key: "aqua" },
    { name: "BEAST", key: "beast" },
    { name: "BEAST-WARRIOR", key: "beast_warrior" },
    { name: "CREATOR GOD", key: "creator_god" },
    { name: "CYBERSE", key: "cyberse" },
    { name: "DINOSAUR", key: "dinosaur" },
    { name: "DIVINE-BEAST", key: "divine_beast" },
    { name: "DRAGON", key: "dragon" },
    { name: "FAIRY", key: "fairy" },
    { name: "FIEND", key: "fiend" },
    { name: "FISH", key: "fish" },
    { name: "INSECT", key: "insect" },
    { name: "MACHINE", key: "machine" },
    { name: "PLANT", key: "plant" },
    { name: "PSYCHIC", key: "psychic" },
    { name: "PYRO", key: "pyro" },
    { name: "REPTILE", key: "reptile" },
    { name: "ROCK", key: "rock" },
    { name: "SEA SERPENT", key: "sea_serpent" },
    { name: "SPELLCASTER", key: "spellcaster" },
    { name: "THUNDER", key: "thunder" },
    { name: "WARRIOR", key: "warrior" },
    { name: "WINGED BEAST", key: "winged_beast" },
    { name: "WYRM", key: "wyrm" },
    { name: "ZOMBIE", key: "zombie" }
];

const TYPE_SPELLS = [
    {
        name: 'ALL',
        key: 'all'
    },
    {
        name: 'NORMAL',
        key: 'normal'
    },
    {
        name: 'FIELD',
        key: 'field'
    },
    {
        name: 'EQUIP',
        key: 'equip'
    },
    {
        name: 'QUICK_PLAY',
        key: 'quickPlay'
    },
    {
        name: 'CONTINUOUS',
        key: 'continuous'
    },
    {
        name: 'RITUAL',
        key: 'ritual'
    }
]

const TYPE_TRAPS = [
    {
        name: 'ALL',
        key: 'all'
    },
    {
        name: 'NORMAL',
        key: 'normal'
    },
    {
        name: 'CONTINUOUS',
        key: 'continuous'
    },
    {
        name: 'COUNTER',
        key: 'counter'
    }
]

const TYPE_ATTRIBUTES = [
    {
        name: 'ALL',
        key: 'all'
    },
    {
        name: 'DARK',
        key: 'dark'
    },
    {
        name: 'LIGHT',
        key: 'light'
    },
    {
        name: 'EARTH',
        key: 'earth'
    },
    {
        name: 'WATER',
        key: 'water'
    },
    {
        name: 'FIRE',
        key: 'fire'
    },
    {
        name: 'WIND',
        key: 'wind'
    },
    {
        name: 'DIVINE',
        key: 'divine'
    }
]

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

const FILTER_GROUP = {
    MONSTER: ["monsterCategory", "monsterAttribute", "lte", "gte", "monsterType"],
    SPELL: ["spellType"],
    TRAP: ["trapType"],
};

const NEED_MONSTER_CATEGORY = ["monsterAttribute", "gte", "lte", "monsterType"]

const TYPE_CARDS = {
    MONSTER: "MONSTER",
    TRAP: "TRAP",
    SPELL: "SPELL"
}


export { TYPE_CATEGORIES_MONSTERS, TYPE_CARDS, TYPE_SPELLS, SPELL_ICONS, TYPE_TRAPS, FILTER_GROUP, TYPE_ATTRIBUTES, ATTRIBUTE_ICONS, TRAP_ICONS, MONSTER_TYPES, NEED_MONSTER_CATEGORY };