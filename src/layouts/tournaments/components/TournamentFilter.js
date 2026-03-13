import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import MDButton from 'components/MDButton';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { STATUS_TOURNAMENT } from 'config/constant';
import { TYPE_TOURNAMENTS } from 'config/constant';
import MDBox from 'components/MDBox';

const TournamentFilter = ({ filter, setFilter, setOpen }) => {

    const handleChangeStatus = (event) => {
        setFilter((prev) => ({
            ...prev,
            status: event.target.value
        }))
    };

    const handleChangeType = (event) => {
        setFilter((prev) => ({
            ...prev,
            type: event.target.value
        }))
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSearchText = (event) => {
        const val = event.target.value;
        if (val !== filter.text) {
            setFilter((prev) => ({
                ...prev,
                text: val
            }))
        }
    }
    return (
        <MDBox pt={3} pb={4}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                }}
            >
                {/* Search */}
                <TextField
                    label="Tên giải đấu"
                    value={filter.text}
                    onChange={handleSearchText}
                    sx={{
                        width: {
                            xs: "100%",
                            md: "40%",
                        },
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        width: {
                            xs: "100%",
                            md: "55%",
                        },
                        justifyContent: {
                            xs: "flex-start",
                            md: "space-between",
                        },
                    }}
                >
                    {/* Status */}
                    <FormControl
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "30%",
                                md: "30%",
                            },
                        }}
                    >
                        <InputLabel>Trạng thái</InputLabel>

                        <Select
                            value={filter.status}
                            label="Trạng thái"
                            onChange={handleChangeStatus}
                            sx={{ p: 1.5 }}
                        >
                            {STATUS_TOURNAMENT.map((s) => (
                                <MenuItem key={s.key} value={s.key} sx={{ color: s.color || "inherit" }}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Type */}
                    <FormControl
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "30%",
                                md: "30%",
                            },
                        }}
                    >
                        <InputLabel>Loại</InputLabel>

                        <Select
                            value={filter.type}
                            label="Loại"
                            onChange={handleChangeType}
                            sx={{ p: 1.5 }}
                        >
                            {TYPE_TOURNAMENTS.map((s) => (
                                <MenuItem key={s.key} value={s.key}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Button */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: {
                                xs: "flex-start",
                                md: "flex-end",
                            },
                            width: {
                                xs: "100%",
                                md: "auto",
                            },
                        }}
                    >
                        <MDButton variant="gradient" color="primary" onClick={handleClickOpen}>
                            Tạo giải đấu mới
                        </MDButton>
                    </Box>
                </Box>
            </Box>
        </MDBox>
    )
}

export default TournamentFilter