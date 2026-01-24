import MDBox from 'components/MDBox';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Fillter from './components/Fillter';
import ShowCards from './components/ShowCards';

function Cards() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <MDBox sx={{ display: 'flex', gap: 2, height: '100%', mb: 4 }}>
                <MDBox sx={{ flex: '0 0 75%' }}>
                    <ShowCards />
                </MDBox>
                <MDBox sx={{ flex: '0 0 25%', maxHeight: '100vh', overflow: 'auto' }}>
                    <Fillter />
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Cards;
