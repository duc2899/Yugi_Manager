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

import aqua from 'assets/images/monsterType/aqua.png';
import beast from 'assets/images/monsterType/beast.png';
import beastWarrior from 'assets/images/monsterType/beast_warrior.png';
import creatorGod from 'assets/images/monsterType/creator_god.png';
import cyberse from 'assets/images/monsterType/cyberse.png';
import dinosaur from 'assets/images/monsterType/dinosaur.png';
import divineBeast from 'assets/images/monsterType/divine_beast.png';
import dragon from 'assets/images/monsterType/dragon.png';
import fairy from 'assets/images/monsterType/fairy.png';
import fiend from 'assets/images/monsterType/fiend.png';
import fish from 'assets/images/monsterType/fish.png';
import insect from 'assets/images/monsterType/insect.png';
import machine from 'assets/images/monsterType/machine.png';
import plant from 'assets/images/monsterType/plant.png';
import psychic from 'assets/images/monsterType/psychic.png';
import pyro from 'assets/images/monsterType/pyro.png';
import reptile from 'assets/images/monsterType/reptile.png';
import rock from 'assets/images/monsterType/rock.png';
import seaSerpent from 'assets/images/monsterType/sea_serpent.png';
import spellcaster from 'assets/images/monsterType/spell_caster.png';
import thunder from 'assets/images/monsterType/thunder.png';
import warrior from 'assets/images/monsterType/warrior.png';
import wingedBeast from 'assets/images/monsterType/winged_beast.png';
import wyrm from 'assets/images/monsterType/wyrm.png';
import zombie from 'assets/images/monsterType/zombie.png';



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
    { key: "AQUA", name: "Aqua", icon: aqua },
    { key: "BEAST", name: "Beast", icon: beast },
    { key: "BEAST-WARRIOR", name: "Beast-Warrior", icon: beastWarrior },
    { key: "CREATOR GOD", name: "Creator God", icon: creatorGod },
    { key: "CYBERSE", name: "Cyberse", icon: cyberse },
    { key: "DINOSAUR", name: "Dinosaur", icon: dinosaur },
    { key: "DIVINE-BEAST", name: "DIVINE-BEAST", icon: divineBeast },
    { key: "DRAGON", name: "Dragon", icon: dragon },
    { key: "FAIRY", name: "Fairy", icon: fairy },
    { key: "FIEND", name: "Fiend", icon: fiend },
    { key: "FISH", name: "Fish", icon: fish },
    { key: "INSECT", name: "Insect", icon: insect },
    { key: "MACHINE", name: "Machine", icon: machine },
    { key: "PLANT", name: "Plant", icon: plant },
    { key: "PSYCHIC", name: "Psychic", icon: psychic },
    { key: "PYRO", name: "Pyro", icon: pyro },
    { key: "REPTILE", name: "Reptile", icon: reptile },
    { key: "ROCK", name: "Rock", icon: rock },
    { key: "SEA SERPENT", name: "Sea Serpent", icon: seaSerpent },
    { key: "SPELLCASTER", name: "Spellcaster", icon: spellcaster },
    { key: "THUNDER", name: "Thunder", icon: thunder },
    { key: "WARRIOR", name: "Warrior", icon: warrior },
    { key: "WINGED BEAST", name: "Winged Beast", icon: wingedBeast },
    { key: "WYRM", name: "Wyrm", icon: wyrm },
    { key: "ZOMBIE", name: "Zombie", icon: zombie }
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

const DECK_LIMIT = {
    MAIN: 60,
    EXTRA: 15,
    SIDE: 15,
};

export { CARD_TYPES, CARD_TYPE, TYPE_ATTRIBUTES, TYPE_MONSTERS, ATTRIBUTE_ICONS, SPELL_ICONS, TRAP_ICONS, TYPE_BY_CATEGORY, DECK_LIMIT };