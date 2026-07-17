import { STATUS_TOURNAMENT } from 'config/constant';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const convertTimeVN = (timeString, isShowDetail = true) => {
    if (!timeString) return 'Chưa từng hoạt động';

    if (isShowDetail) {
        return format(new Date(timeString), 'dd/MM/yyyy HH:mm:ss', { locale: vi })
    }

    // Ép kiểu chuỗi ISO sang đối tượng Date chuẩn
    const date = new Date(timeString);

    // Kiểm tra xem chuỗi đầu vào có hợp lệ không
    if (isNaN(date.getTime())) return 'Thời gian không hợp lệ';

    return formatDistanceToNow(date, {
        locale: vi,
        addSuffix: true // Để hiển thị thêm chữ "trước"
    });
}

/**
 * Format price to VND currency
 * @param {number|string} price - The price to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showSymbol - Show ₫ symbol (default: true)
 * @param {boolean} options.showFull - Show "đ" instead of "₫" (default: false)
 * @param {string} options.decimalSeparator - Decimal separator (default: ',')
 * @returns {string} Formatted price string
 */
const convertPriceVND = (price, options = {}) => {
    const {
        showSymbol = true,
        showFull = false,
    } = options;

    // Convert to number if it's a string
    const num = typeof price === 'string'
        ? parseFloat(price.replace(/[^\d.-]/g, ''))
        : Number(price);

    // Handle invalid numbers
    if (isNaN(num)) return 'Invalid price';

    // Format with thousand separators
    const formatted = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Add currency symbol
    if (!showSymbol) return formatted;

    const symbol = showFull ? 'đ' : '₫';
    return `${formatted}${symbol}`;
};


/**
 * Format timestamp to fixed format
 * @param {number|string} ts - The timestamp to format
 */
const formatTimestampFixed = (ts) => {
    const d = new Date(ts);

    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Format timestamp to Vietnam time
 * @param {number|string} ts - The timestamp to format
 */
const formatTimestampVN = (ts) => {

    const d = new Date(ts);

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    return formatter.format(d);
};

/**
 * Get status info
 * @param {string} key - status key
 * @param {string} type - "color" | "name"
 */
const getStatusInfo = (key, type = "color") => {
    const status = STATUS_TOURNAMENT.find((item) => item.key === key);

    if (!status) return type === "color" ? "#999" : "";

    return status[type];
};

export {
    convertTimeVN,
    convertPriceVND,
    formatTimestampFixed,
    formatTimestampVN,
    getStatusInfo
}