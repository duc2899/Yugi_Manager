import { useEffect, useState } from 'react';

import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Fillter from './components/CardFilter';
import ShowCards from './components/CardTable';

function Cards() {
    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState({
        monsterType: [],
        monsterCategories: [],
        type: null,
        monsterAttribute: [],
        level: null,
        spellType: null,
        trapType: null
    })
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <MDBox sx={{ display: 'flex', gap: 2, height: '100vh', mb: 4 }}>
                <MDBox sx={{ flex: '0 0 75%', height: '100%', }}>
                    <ShowCards cards={cards} setCards={setCards}/>
                </MDBox>
                <MDBox sx={{ flex: '0 0 25%', maxHeight: '100%', }}>
                    <Fillter filter={filter} setFilter={setFilter}/>
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Cards;
