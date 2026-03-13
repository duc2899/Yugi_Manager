import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import CreateTournaments from './components/CreateTournamentModal';
import TournamentTable from './components/TournamentTable';
import TournamentFilter from './components/TournamentFilter';

import { getTournaments } from 'api/tournamentsAPI';

function Tournaments() {

    const [filter, setFilter] = useState({
        status: "ALL",
        type: "ALL",
        text: ""
    })
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [debouncedSearchText] = useDebounce(filter.text, 500);

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };

            if (filter.status && filter.status !== "ALL") {
                params.status = filter.status;
            }

            if (filter.type && filter.type !== "ALL") {
                params.type = filter.type;
            }

            if (debouncedSearchText) {
                params.name = debouncedSearchText.trim();
            }

            const response = await getTournaments(params);

            setData(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, filter.status, filter.type, debouncedSearchText]);


    return (
        <DashboardLayout>
            <DashboardNavbar />

            <TournamentFilter setFilter={setFilter} filter={filter} setOpen={setOpen}></TournamentFilter>
            <TournamentTable data={data} pagination={pagination} setPagination={setPagination}></TournamentTable>

            <Footer />
            <CreateTournaments open={open} handleClose={handleClose} fectchData={fetchData} />
        </DashboardLayout >
    );
}

export default Tournaments;
