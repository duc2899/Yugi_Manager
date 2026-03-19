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
        name: 'QUICK-PLAY',
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
    MONSTER: ["monsterType", "monsterCategory", "monsterAttribute", "level"],
    SPELL: ["spellType"],
    TRAP: ["trapType"]
};

export { TYPE_CATEGORIES_MONSTERS, TYPE_SPELLS, SPELL_ICONS, TYPE_TRAPS, FILTER_GROUP, TYPE_ATTRIBUTES, ATTRIBUTE_ICONS, TRAP_ICONS };