import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";

const DetailTournament = () => {
    const { id } = useParams();

    return (
        <DashboardLayout>
            <DashboardNavbar></DashboardNavbar>

            <h2>{id}</h2>
        </DashboardLayout>
    )
}

export default DetailTournament