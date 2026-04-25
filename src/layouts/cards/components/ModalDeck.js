import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { normalizeDeck, updateDeckOption } from "../../../helpers/card";

const ModalDeck = ({ modalDeck, setModalDeck, deck, setDeck, setLocalDecks, initialDeckRef, setSnapshotHash, setSelectDeck, selectedDeckId, setDataDeck }) => {
    const DATA_TYPE = [
        {
            name: "Cơ bản",
            id: "DEFAULT",
        },
        {
            name: "Bán",
            id: "SELLER",
        },
    ]

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            type: ""
        },
    });

    const onSubmit = async (data) => {
        // ===== CREATE =====
        if (modalDeck.type === "CREATE") {
            const localId = `LOCAL_${Date.now()}`;

            const newDeckState = {
                mainDeckCards: [],
                extraDeckCards: [],
                sideDeckCards: [],
                name: data.name,
                type: data.type,
                id: localId,
                isLocal: true,
            };

            const newDeckOption = {
                _id: localId,
                name: data.name,
                type: data.type,
                isLocal: true,
            };

            setLocalDecks((prev) => [newDeckOption, ...prev]);
            setSelectDeck(localId);
            setDeck(newDeckState);

            // snapshot
            initialDeckRef.current = structuredClone(newDeckState);
            setSnapshotHash(JSON.stringify(normalizeDeck(newDeckState)));

            reset();
            handleClose();
            return;
        }

        // ===== EDIT =====
        if (modalDeck.type === "EDIT") {
            setDeck((prev) => ({
                ...prev,
                name: data.name,
                type: data.type,
            }));
            updateDeckOption(selectedDeckId, {
                name: data.name,
                type: data.type,
            }, setLocalDecks, setDataDeck);

            reset();
            handleClose();
        }
    };

    useEffect(() => {
        if (modalDeck.type === "EDIT") {
            setValue("name", modalDeck.data.name);
            setValue("type", modalDeck.data.type);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDeck.type]);

    const handleClose = () => {
        reset()
        setModalDeck({
            isOpen: false,
            type: "EMPTY",
            data: {
                type: "",
                name: ""
            }
        })
    }

    return (
        <MDDialog
            open={modalDeck.isOpen && modalDeck.type !== "EMPTY"}
            onClose={handleClose}
            title={`${modalDeck.type === "CREATE" ? "Tạo bộ bài" : "Chỉnh sửa bộ bài"}`}
            content={
                <MDBox>
                    <FormControl
                        sx={{
                            width: "100%",
                            marginBottom: "30px"
                        }}
                    >
                        <InputLabel>Loại</InputLabel>

                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Vui lòng chọn loại deck" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Loại"
                                    sx={{ pt: 1.5, pb: 1.5 }}
                                >
                                    {DATA_TYPE.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.type && (
                            <p style={{ color: "red", fontSize: "13px" }}>{errors.type.message}</p>
                        )}
                    </FormControl>

                    <MDInput
                        label="Tên bộ bài"
                        fullWidth
                        error={!!errors.name}
                        {...register("name", {
                            required: "Vui lòng nhập tên bộ bài",
                        })}
                        helperText={!!errors.name && errors.name.message}
                    />
                </MDBox>
            }
            actions={
                <>
                    <MDButton onClick={handleClose} color="error" disabled={isSubmitting}>
                        Hủy
                    </MDButton>

                    <MDButton
                        color="success"
                        onClick={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {modalDeck.type === "CREATE" ? "Tạo" : "Sửa"}
                    </MDButton>
                </>
            }
        />
    );
}

export default ModalDeck