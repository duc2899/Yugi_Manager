import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import MDButton from "components/MDButton";
import { createTournamentSchema } from "utils/schemaYup";
import { createTournament } from 'api/tournamentsAPI';
import { useState } from 'react';
import { useAlert } from 'context/AlertContext';

const CreateTournaments = ({ open, handleClose }) => {
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(createTournamentSchema),
        defaultValues: {
            name: '',
            type: '',
            rubyFee: '',
            rubyReward: '',
            limitNumberPlayers: '',
            roundStartedTime: dayjs(),
        },
    });


    const TYPE_TUOURNAMENT = [
        {
            value: "Server",
            key: "SERVER"
        },
        {
            value: "Local",
            key: "LOCAL"
        }
    ]

    const onSubmit = async (data) => {
        setIsLoading(true);
        const payload = {
            ...data,
            roundStartedTime: data.roundStartedTime.format('DD-MM-YYYY HH:mm'),
        };

        try {
            const dataResult = await createTournament(payload);
            console.log(dataResult);
        } catch (error) {
            setIsLoading(false);
            showAlert("Lỗi không tạo được tournament", "error");
            return;
        }

        setIsLoading(false);

        reset();
        handleClose();
    };




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
                                    {TYPE_TUOURNAMENT.map((item) => (
                                        <MenuItem key={item.key} value={item.key}>
                                            {item.value}
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
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <MDButton onClick={handleClose} color="error" >Hủy</MDButton>
                <MDButton autoFocus color="success" onClick={handleSubmit(onSubmit)} loading={isLoading}>
                    Tạo
                </MDButton>
            </DialogActions>
        </Dialog>
    )
}

export default CreateTournaments