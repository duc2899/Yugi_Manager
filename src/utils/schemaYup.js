import * as yup from 'yup';
import dayjs from 'dayjs';

export const createTournamentSchema = yup.object({
    name: yup
        .string()
        .required('Tên giải đấu không được để trống')
        .min(3, 'Tên giải đấu tối thiểu 3 ký tự'),

    type: yup
        .string()
        .required('Vui lòng chọn loại giải đấu'),

    rubyFee: yup
        .number()
        .typeError('Phí tham gia phải là số')
        .required('Vui lòng nhập phí tham gia')
        .min(0, 'Phí không được âm'),

    rubyReward: yup
        .number()
        .typeError('Phần thưởng phải là số')
        .required('Vui lòng nhập phần thưởng')
        .min(0, 'Phần thưởng không được âm'),

    limitNumberPlayers: yup
        .number()
        .typeError('Số lượng phải là số')
        .required('Vui lòng nhập số lượng')
        .min(4, 'Số lượng tối thiểu là 4'),

    roundStartedTime: yup
        .mixed()
        .required('Vui lòng chọn thời gian bắt đầu')
        .test(
            'min-2-minutes',
            'Thời gian bắt đầu phải sau hiện tại ít nhất 2 phút',
            (value) => {
                if (!value) return false;

                const nowPlus2Minutes = dayjs().add(2, 'minute');
                return dayjs(value).isAfter(nowPlus2Minutes);
            }
        ),
});
