import React from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { Box, Tooltip } from '@mui/material';


import star from 'assets/images/star.png';


import { TYPE_SPELLS, TYPE_TRAPS, TYPE_ATTRIBUTES, TYPE_CATEGORIES_MONSTERS } from 'config/filter';
import IconFilterGroup from './IconFilterGroup';
import { SPELL_ICONS } from 'config/filter';
import { TRAP_ICONS } from 'config/filter';
import { ATTRIBUTE_ICONS } from 'config/filter';

function Filter({ filter, setFilter }) {

    const handleChangeFilter = (field, isMultiple = false) => (value) => {
        setFilter((prev) => {
            if (isMultiple) {
                // dạng array (multi select)
                const current = prev[field] || [];

                if (value === "all") {
                    return { ...prev, [field]: [] };
                }

                const exists = current.includes(value);

                return {
                    ...prev,
                    [field]: exists
                        ? current.filter((i) => i !== value)
                        : [...current, value]
                };
            }

            // dạng single (radio-like)
            return {
                ...prev,
                [field]: prev[field] === value ? null : value
            };
        });
    };

    return (
        <MDBox sx={{ p: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: "100%" }}>

            <IconFilterGroup
                title="Monster Type"
                data={TYPE_CATEGORIES_MONSTERS}
                selected={filter.monsterType}
                onSelect={handleChangeFilter("monsterType", true)}
                icons={[]}
            />

            <IconFilterGroup
                title="Spell"
                data={TYPE_SPELLS}
                selected={filter.spellType ? [filter.spellType] : []}
                onSelect={handleChangeFilter("spellType")}
                icons={SPELL_ICONS}
            />

            <IconFilterGroup
                title="Trap"
                data={TYPE_TRAPS}
                selected={filter.trapType ? [filter.trapType] : []}
                onSelect={handleChangeFilter("trapType")}
                icons={TRAP_ICONS}
            />

            <IconFilterGroup
                title="Attribute"
                data={TYPE_ATTRIBUTES}
                selected={filter.monsterAttribute}
                onSelect={handleChangeFilter("monsterAttribute", true)}
                icons={ATTRIBUTE_ICONS}
            />

            <MDTypography variant="h6" sx={{ mb: '15px', fontWeight: 600, color: '#fff' }}>
                Star Level
            </MDTypography>
            <Box sx={{ display: 'flex', gap: '8px', mb: '25px', flexWrap: 'wrap' }}>
                {[...Array(12)].map((_, index) => {
                    const starLevel = index + 1;
                    const isSelected = starLevel <= filter.level;
                    return (
                        <Tooltip key={starLevel} title={`${starLevel} stars`} arrow>
                            <img
                                src={star}
                                alt={`${starLevel} stars`}
                                key={starLevel}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', opacity: isSelected ? 1 : 0.5, }}
                                onClick={() => handleChangeFilter("level")(starLevel)}
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

export default Filter;