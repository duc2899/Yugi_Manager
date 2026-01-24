import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';

import { useState } from 'react';
import billApi from 'api/billAPI';
import { convertPriceVND } from 'utils';
import chartApi from 'api/charts';

function Dashboard() {
    const [chartDataBill, setChartDataBill] = useState({
        labels: [],
        datasets: {
            label: 'Daily Sales',
            data: []
        },
        highestMonth: {}
    });

    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        currentMonthUsers: 0,
        lastMonthUsers: 0,
        percentageChange: 0,
        currentDayUsers: 0
    });

    const fetchChartData = async () => {
        try {
            const response = await billApi.getChartDataBill();
            setChartDataBill(response.data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await chartApi.getUserStats();
            setUserStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    // Fetch chart data when the component mounts
    // useState(() => {
    //     fetchChartData();
    //     fetchUserStats();
    // }, []);


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="weekend"
                                title="Bookings"
                                count={281}
                                percentage={{
                                    color: 'success',
                                    amount: '+55%',
                                    label: 'than lask week'
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="success"
                                icon="store"
                                title="Revenue"
                                count="34k"
                                percentage={{
                                    color: 'success',
                                    amount: '+1%',
                                    label: 'than yesterday'
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="leaderboard"
                                title="Current Month Users"
                                count={userStats.currentMonthUsers}
                                percentage={{
                                    color: 'success',
                                    amount: `${userStats.percentageChange}%`,
                                    label: 'than last month'
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="person_add"
                                title="Total Users"
                                count={userStats.totalUsers}
                                percentage={{
                                    color: 'success',
                                    amount: `+ ${userStats.currentDayUsers}`,
                                    label: 'users today'
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="success"
                                    title="Monthly Bills"
                                    description={
                                        <>
                                            High month is {chartDataBill.highestMonth.month} (<strong style={{
                                                color: "greenyellow"
                                            }}>+{convertPriceVND(chartDataBill.highestMonth.value)}</strong>)
                                        </>
                                    }

                                    date="updated 4 min ago"
                                    chart={chartDataBill}
                                />
                            </MDBox>
                        </Grid>

                    </Grid>
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Dashboard;
