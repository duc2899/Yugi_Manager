import { useState } from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import utc from "dayjs/plugin/utc";

import MDButton from "components/MDButton";
import { createTournamentSchema } from "utils/schemaYup";
import tournamentAPI from 'api/tournamentsAPI';
import { useAlert } from 'hooks/useAlert';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import cardApi from 'api/cardAPI';
import { TYPE_TOURNAMENTS } from 'config/constant';


const CreateTournaments = ({ open, handleClose, fectchData }) => {

    dayjs.extend(utc);

    const { showAlert } = useAlert();
    const [cardBanList, setCardBanList] = useState([]);
    const [inputCardBan, setInputCardBan] = useState('');
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(createTournamentSchema),
        defaultValues: {
            name: '',
            type: 'SERVER',
            rubyFee: '',
            rubyReward: '',
            limitNumberPlayers: '',
            roundStartedTime: dayjs(),
        },
    });

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            roundStartedTime: dayjs(data.roundStartedTime).utc().format('DD-MM-YYYY HH:mm'),
            bannishCardCodes: cardBanList
        };

        try {
            await tournamentAPI.createTournament({
                data: payload
            });
        } catch (error) {
            showAlert("Lỗi không tạo được tournament", "error");
            return;
        }

        reset();
        showAlert("Tạo giải đấu thành công", "success");
        fectchData()
        handleClose();
    };

    const handelAddCardBan = async () => {
        if (!inputCardBan) return;
        if (cardBanList.includes(inputCardBan)) {
            showAlert("Card ID đã được thêm vào danh sách", "infor");
            return;
        };
        try {
            await cardApi.checkExitCardById(inputCardBan);
            setCardBanList((prev) => [...prev, inputCardBan]);
            setInputCardBan('');
        } catch (error) {
            showAlert("Card ID không tồn tại", "warning");
        }
    }

    const handelRemoveCardBan = (cardId) => {
        setCardBanList((prev) => prev.filter((id) => id !== cardId));
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
        >
            <DialogTitle >
                {"Tạo giải đấu mới"}
            </DialogTitle>
            <DialogContent sx={{
                pt: 4
            }}>
                <DialogContentText >
                    <TextField
                        label="Tên giải đấu"
                        fullWidth
                        margin="normal"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.type}>
                        <InputLabel>Loại giải đấu</InputLabel>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Loại giải đấu" sx={{ p: 1.5 }}>
                                    {TYPE_TOURNAMENTS.map((item) => item.key !== "ALL" && (
                                        <MenuItem key={item.key} value={item.key}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.type && (
                            <p style={{ color: '#d32f2f', fontSize: 12 }}>
                                {errors.type.message}
                            </p>
                        )}
                    </FormControl>
                    <TextField label="Phí tham gia" fullWidth margin="normal" type="number" {...register('rubyFee')} error={!!errors.rubyFee} helperText={errors.rubyFee?.message} />
                    <TextField label="Phần thưởng tham gia" fullWidth margin="normal" type="number" {...register('rubyReward')} error={!!errors.rubyReward} helperText={errors.rubyReward?.message} />
                    <TextField label="Số lượng tham gia" fullWidth margin="normal" type="number" {...register('limitNumberPlayers')} error={!!errors.limitNumberPlayers} helperText={errors.limitNumberPlayers?.message} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="roundStartedTime"
                            control={control}
                            render={({ field }) => (
                                <DateTimePicker
                                    {...field}
                                    label="Thời gian bắt đầu"
                                    format="DD-MM-YYYY HH:mm"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'normal',
                                            error: !!errors.roundStartedTime,
                                            helperText: errors.roundStartedTime?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <MDBox sx={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 2
                    }}>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField label="Card ID Ban" type="number" onChange={(e) => setInputCardBan(e.target.value)} value={inputCardBan} />
                            <MDButton color="info" iconOnly startIcon={<AddIcon />} onClick={handelAddCardBan}></MDButton>
                        </MDBox>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <MDTypography fontSize={14} >
                                Số card bị ban:
                            </MDTypography>
                            <MDTypography fontWeight="bold" fontSize={14} color="primary">{cardBanList.length}</MDTypography>
                        </Stack>
                    </MDBox>
                    <MDBox
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mt: 2    // khoảng cách giữa các card
                        }}
                    >
                        {cardBanList.map((item, index) => (
                            <MDBox
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: { xs: 80, sm: 100, md: 120 }
                                }}
                            >
                                {/* Image wrapper */}
                                <MDBox sx={{ position: 'relative' }}>
                                    <img
                                        src={`https://images.ygoprodeck.com/images/cards_small/${item}.jpg`}
                                        style={{
                                            width: '100%',
                                            display: 'block',
                                            borderRadius: 6
                                        }}
                                        alt={`Card ${index}`}
                                    />

                                    {/* Close icon */}
                                    <CloseIcon
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            fontSize: 18,
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                            color: '#fd0000',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            padding: '2px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,1)'
                                            }
                                        }}
                                        onClick={() => handelRemoveCardBan(item)}
                                    />
                                </MDBox>

                                <MDTypography
                                    fontSize={13}
                                    sx={{ textAlign: 'center', mt: 0.5 }}
                                >
                                    {item}
                                </MDTypography>
                            </MDBox>
                        ))}
                    </MDBox>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <MDButton onClick={handleClose} color="error" >Hủy</MDButton>
                <MDButton autoFocus color="success" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                    Tạo
                </MDButton>
            </DialogActions>
        </Dialog>
    )
}

export default CreateTournaments