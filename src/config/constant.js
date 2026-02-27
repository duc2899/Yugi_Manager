import Momo from "../assets/images/logos/momo.png"
import Sepay from "../assets/images/logos/seapay.png"
import ZaloPay from "../assets/images/logos/zalopay.png"

const PaymentLogo = ({ src, alt }) => (
    <img
        src={src}
        alt={alt}
        style={{
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            borderRadius: '4px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
    />
);

const PAYMENT_METHODS = [
    {
        name: "Momo",
        image: <PaymentLogo src={Momo} alt="Momo" />
    },
    {
        name: "Sepay",
        image: <PaymentLogo src={Sepay} alt="Sepay" />
    },
    {
        name: "ZaloPay",
        image: <PaymentLogo src={ZaloPay} alt="ZaloPay" />
    },
]

const ROLE_ACCOUNT = ["user", "admin"]

const STATUS_BILL = [
    'Pending',
    'WaitingPayment',
    'Paid',
    'Failed',
    'Cancelled',
    'Expired',
]

const URL_IMAGE = "https://images.ygoprodeck.com/images/cards_small/"

export {
    PAYMENT_METHODS,
    STATUS_BILL,
    ROLE_ACCOUNT,
    URL_IMAGE
}