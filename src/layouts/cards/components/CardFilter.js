import React from 'react';

import MDBox from 'components/MDBox';
import { TYPE_SPELLS, TYPE_TRAPS, TYPE_ATTRIBUTES, MONSTER_TYPES, TYPE_CATEGORIES_MONSTERS, SPELL_ICONS, TRAP_ICONS, FILTER_GROUP, ATTRIBUTE_ICONS, NEED_MONSTER_CATEGORY } from 'config/card';
import IconFilterGroup from './IconFilterGroup';
import { hasValue, resetFields } from 'helpers/card';
import RangeFilter from './RangeFilter';
import { TYPE_CARDS } from 'config/card';

function Filter({ filter, setFilter }) {

    const getGroupByField = (field) => {
        if (FILTER_GROUP.MONSTER.includes(field)) return TYPE_CARDS.MONSTER;
        if (FILTER_GROUP.SPELL.includes(field)) return TYPE_CARDS.SPELL;
        if (FILTER_GROUP.TRAP.includes(field)) return TYPE_CARDS.TRAP;
        return null;
    };


    const handelResetField = (field) => {
        setFilter((prev) => {
            const group = getGroupByField(field);

            let newFilter = {
                ...prev,
                [field]: Array.isArray(prev[field]) ? [] : null
            };

            // nếu field thuộc group → reset cả group
            if (group) {
                newFilter = resetFields(newFilter, FILTER_GROUP[group]);

                // check xem còn field nào trong group còn value không
                const stillHasValue = FILTER_GROUP[group].some((f) =>
                    hasValue(newFilter[f])
                );

                newFilter.type = stillHasValue ? group : null;
            }

            return newFilter;
        });
    };

    const handleChangeFilter = (field, isMultiple = false) => (value) => {
        setFilter((prev) => {

            // ===== 🚫 GUARD =====
            if (NEED_MONSTER_CATEGORY.includes(field) && !prev.monsterCategory?.length) {
                return prev;
            }

            const group = getGroupByField(field);

            // ===== 🆕 RANGE =====
            if (field === "gte" || field === "lte") {
                const newFilter = {
                    ...prev,
                    gte: value.gte ?? null,
                    lte: value.lte ?? null,
                };

                if (!hasValue(newFilter.gte) && !hasValue(newFilter.lte)) {
                    const reset = resetFields(newFilter, FILTER_GROUP.MONSTER);
                    return { ...reset, type: null };
                }

                return { ...newFilter, type: TYPE_CARDS.MONSTER };
            }

            // ===== 1. UPDATE VALUE =====
            let newValue;

            if (isMultiple) {
                const current = prev[field] || [];

                if (value == "all") {
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

            // ===== 2. CLEAR VALUE =====
            if (!hasValue(newValue)) {
                if (group) {
                    newFilter = resetFields(newFilter, FILTER_GROUP[group]);
                }

                return {
                    ...newFilter,
                    type: null
                };
            }

            // ===== 3. KHÔNG THUỘC GROUP =====
            if (!group) return newFilter;

            // ===== 4. RESET GROUP KHÁC =====
            Object.keys(FILTER_GROUP)
                .filter((g) => g !== group)
                .forEach((g) => {
                    newFilter = resetFields(newFilter, FILTER_GROUP[g]);
                });

            // ===== 5. SET TYPE =====
            return {
                ...newFilter,
                type: group
            };
        });
    };

    return (
        <MDBox
            borderRadius="3px"
            border="2"
            opacity="2"
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "85%",
                overflow: "auto",
            }}
        >

            <IconFilterGroup
                title="Monster Categories"
                data={TYPE_CATEGORIES_MONSTERS}
                selected={filter.monsterCategory}
                onSelect={handleChangeFilter("monsterCategory", true)}
                onReset={() => handelResetField("monsterCategory")}
                icons={[]}
            />

            <IconFilterGroup
                title="Monster Type"
                data={MONSTER_TYPES}
                selected={filter.monsterType}
                onSelect={handleChangeFilter("monsterType", true)}
                onReset={() => handelResetField("monsterType")}
                icons={[]}
            />

            <IconFilterGroup
                title="Spell"
                data={TYPE_SPELLS}
                selected={filter.spellType ? [filter.spellType] : []}
                onSelect={handleChangeFilter("spellType")}
                onReset={() => handelResetField("spellType")}
                icons={SPELL_ICONS}
            />

            <IconFilterGroup
                title="Trap"
                data={TYPE_TRAPS}
                selected={filter.trapType ? [filter.trapType] : []}
                onSelect={handleChangeFilter("trapType")}
                onReset={() => handelResetField("trapType")}
                icons={TRAP_ICONS}
            />

            <IconFilterGroup
                title="Attribute"
                data={TYPE_ATTRIBUTES}
                selected={filter.monsterAttribute}
                onSelect={handleChangeFilter("monsterAttribute", true)}
                onReset={() => handelResetField("monsterAttribute")}
                icons={ATTRIBUTE_ICONS}
            />

            <RangeFilter
                title="Level"
                value={{ gte: filter.gte, lte: filter.lte }}
                onChange={handleChangeFilter("gte")}
            />
        </MDBox>
    );
}

export default Filter;