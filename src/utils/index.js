import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const convertTimeVN = (time) => {
    return format(new Date(time), 'dd/MM/yyyy HH:mm:ss', { locale: vi })
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

export {
    convertTimeVN,
    convertPriceVND
}