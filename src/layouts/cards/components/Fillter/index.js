import React, { useState } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Box, Tooltip } from '@mui/material';

import normal from 'assets/images/spell/normal.png';
import continuous from 'assets/images/spell/continuous.png';
import counter from 'assets/images/spell/counter.png';
import equip from 'assets/images/spell/equip.png';
import field from 'assets/images/spell/field.png';
import ritual from 'assets/images/spell/ritual.png';
import quickPlay from 'assets/images/spell/quickPlay.png';
import wind from 'assets/images/attributes/wind.png';
import dark from 'assets/images/attributes/dark.png';
import divine from 'assets/images/attributes/divine.png';
import earth from 'assets/images/attributes/earth.png';
import fire from 'assets/images/attributes/fire.png';
import light from 'assets/images/attributes/light.png';
import water from 'assets/images/attributes/water.png';
import star from 'assets/images/star.png';


import { TYPE_MONSTERS, TYPE_SPELLS, TYPE_TRAPS, TYPE_ATTRIBUTES } from 'config/fillter';
import IconFilterGroup from './IconFilterGroup';

function Fillter() {
    const [selectedMonster, setSelectedMonster] = useState(null);
    const [selectedSpell, setSelectedSpell] = useState([]);
    const [selectedTrap, setSelectedTrap] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState([]);
    const [starChoosen, setStarChoosen] = useState(0);
    
    const toggleSelect = (id, setState) => {
        if (id === 'all') {
            setState([]);
        } else {
            setState(prev =>
                prev.includes(id)
                    ? prev.filter(i => i !== id)
                    : [...prev, id]
            );
        }
    };

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

    const ATTRIBUTE_ICONS = {
        dark,
        light,
        earth,
        water,
        fire,
        wind,
        divine
    }
    return (
        <MDBox sx={{ p: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>

            {/* Monster giữ riêng vì UI khác */}
            <MDTypography variant="h6" sx={{ mb: '15px', fontWeight: 600, color: '#fff' }}>
                Monster
            </MDTypography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', mb: '25px' }}>
                {TYPE_MONSTERS.map(item => (
                    <MDButton
                        key={item.key}
                        onClick={() => setSelectedMonster(item.key)}
                        variant={selectedMonster === item.key ? 'contained' : 'outlined'}

                        size="small"
                        sx={{
                            padding: '8px',
                            backgroundColor: selectedMonster === item.key ? '#4a4a4a' : 'transparent',
                            color: selectedMonster === item.key ? '#fff' : '#aaa',
                            border: '1px solid #4a4a4a'
                        }}
                    >
                        {item.name}
                    </MDButton>
                ))}
            </Box>

            <IconFilterGroup
                title="Spell"
                data={TYPE_SPELLS}
                selected={selectedSpell}
                onSelect={(id) => toggleSelect(id, setSelectedSpell)}
                icons={SPELL_ICONS}
            />

            <IconFilterGroup
                title="Trap"
                data={TYPE_TRAPS}
                selected={selectedTrap}
                onSelect={(id) => toggleSelect(id, setSelectedTrap)}
                icons={TRAP_ICONS}
            />

            <IconFilterGroup
                title="Attribute"
                data={TYPE_ATTRIBUTES}
                selected={selectedAttribute}
                onSelect={(id) => toggleSelect(id, setSelectedAttribute)}
                icons={ATTRIBUTE_ICONS}
            />

            <MDTypography variant="h6" sx={{ mb: '15px', fontWeight: 600, color: '#fff' }}>
                Star Level
            </MDTypography>
            <Box sx={{ display: 'flex', gap: '8px', mb: '25px', flexWrap: 'wrap' }}>
                {[...Array(12)].map((_, index) => {
                    const starLevel = index + 1;
                    const isSelected = starLevel <= starChoosen;
                    return (
                        <Tooltip key={starLevel} title={`${starLevel} stars`} arrow>
                            <img
                                src={star}
                                alt={`${starLevel} stars`}
                                key={starLevel}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', opacity: isSelected ? 1 : 0.5, }}
                                onClick={() => setStarChoosen(starLevel)}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = isSelected ? 1 : 0.5}
                            />
                        </Tooltip>
                    );

                })}
            </Box>
        </MDBox>
    );
}

export default Fillter;