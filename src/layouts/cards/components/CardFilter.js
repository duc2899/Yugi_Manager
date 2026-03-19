import React from 'react';

import star from 'assets/images/star.png';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { Box, Tooltip } from '@mui/material';
import { TYPE_SPELLS, TYPE_TRAPS, TYPE_ATTRIBUTES, TYPE_CATEGORIES_MONSTERS, SPELL_ICONS, TRAP_ICONS, FILTER_GROUP, ATTRIBUTE_ICONS } from 'config/filter';
import IconFilterGroup from './IconFilterGroup';
import { hasValue, resetFields } from 'helpers/card';

function Filter({ filter, setFilter }) {

   
    
    const handleChangeFilter = (field, isMultiple = false) => (value) => {
        setFilter((prev) => {
            // ===== 1. update value =====
            let newValue;

            if (isMultiple) {
                const current = prev[field] || [];

                if (value === "all") {
                    newValue = [];
                } else {
                    newValue = current.includes(value)
                        ? current.filter((i) => i !== value)
                        : [...current, value];
                }
            } else {
                newValue = prev[field] === value ? null : value;
            }

            let newFilter = {
                ...prev,
                [field]: newValue
            };

            // ===== FIX TOGGLE OFF =====
            if (!hasValue(newValue)) {
                let activeGroup = null;

                if (FILTER_GROUP.MONSTER.includes(field)) activeGroup = "MONSTER";
                if (FILTER_GROUP.SPELL.includes(field)) activeGroup = "SPELL";
                if (FILTER_GROUP.TRAP.includes(field)) activeGroup = "TRAP";

                if (activeGroup) {
                    newFilter = resetFields(newFilter, FILTER_GROUP[activeGroup]);
                }

                return {
                    ...newFilter,
                    type: null
                };
            }

            // ===== 2. determine group =====
            let activeGroup = null;

            if (FILTER_GROUP.MONSTER.includes(field)) activeGroup = "MONSTER";
            if (FILTER_GROUP.SPELL.includes(field)) activeGroup = "SPELL";
            if (FILTER_GROUP.TRAP.includes(field)) activeGroup = "TRAP";

            if (!activeGroup) return newFilter;

            // ===== 3. reset other groups =====
            const otherGroups = Object.keys(FILTER_GROUP).filter(
                (g) => g !== activeGroup
            );

            otherGroups.forEach((group) => {
                newFilter = resetFields(newFilter, FILTER_GROUP[group]);
            });

            // ===== 4. set type =====
            newFilter.type = activeGroup;

            return newFilter;
        });
    };

    return (
        <MDBox sx={{ p: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: "100%" }}>

            <IconFilterGroup
                title="Monster Categories"
                data={TYPE_CATEGORIES_MONSTERS}
                selected={filter.monsterCategory}
                onSelect={handleChangeFilter("monsterCategory", true)}
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