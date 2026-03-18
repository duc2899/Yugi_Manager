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
        name: 'All',
        key: 'all'
    },
    {
        name: 'Normal',
        key: 'normal'
    },
    {
        name: 'Effect',
        key: 'effect'
    },
    {
        name: 'Fusion',
        key: 'fusion'
    },
    {
        name: 'Synchro',
        key: 'synchro'
    },
    {
        name: 'Ritual',
        key: 'ritual'
    },
    {
        name: 'Xyz',
        key: 'xyz'
    },
    {
        name: 'Link',
        key: 'link'
    },
    {
        name: 'Pendulum',
        key: 'pendulum'
    },
    {
        name: 'Token',
        key: 'token'
    },
    {
        name: "Gemini",
        key: "gemini"
    },
    {
        name: "Spirit",
        key: "spirit"
    },
    {
        name: "Toon",
        key: "toon"
    },
    {
        name: "Union",
        key: "union"
    },
    {
        name: "Flip",
        key: "flip"
    },
    {
        name: "Tuner",
        key: "tuner"
    }
]

const TYPE_SPELLS = [
    {
        name: 'All',
        key: 'all'
    },
    {
        name: 'Normal',
        key: 'normal'
    },
    {
        name: 'Field',
        key: 'field'
    },
    {
        name: 'Equip',
        key: 'equip'
    },
    {
        name: 'Quick-Play',
        key: 'quickPlay'
    },
    {
        name: 'Continuous',
        key: 'continuous'
    },
    {
        name: 'Ritual',
        key: 'ritual'
    }
]

const TYPE_TRAPS = [
    {
        name: 'All',
        key: 'all'
    },
    {
        name: 'Normal',
        key: 'normal'
    },
    {
        name: 'Continuous',
        key: 'continuous'
    },
    {
        name: 'Counter',
        key: 'counter'
    }
]

const TYPE_ATTRIBUTES = [
    {
        name: 'All',
        key: 'all'
    },
    {
        name: 'Dark',
        key: 'dark'
    },
    {
        name: 'Light',
        key: 'light'
    },
    {
        name: 'Earth',
        key: 'earth'
    },
    {
        name: 'Water',
        key: 'water'
    },
    {
        name: 'Fire',
        key: 'fire'
    },
    {
        name: 'Wind',
        key: 'wind'
    },
    {
        name: 'Divine',
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

export { TYPE_CATEGORIES_MONSTERS, TYPE_SPELLS, SPELL_ICONS, TYPE_TRAPS, TYPE_ATTRIBUTES, ATTRIBUTE_ICONS, TRAP_ICONS };